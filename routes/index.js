import express from "express";
import { cache, urlShortener } from "../utils/urlShortner.js";
import { client } from "../index.js";
import cron from "node-cron";
import Paste from "../schema/paste.schema.js";
import File from "../schema/file.schema.js";
import fs from "fs";

const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const allPastes = await Paste.find();
    res.json({
      message: "All Pastes Found",
      allPastes,
    });
  } catch (error) {
    res.send(error);
  }
});

router.get(`/file/all`, async (req, res) => {
  try {
    const allFiles = await File.find();
    res.json({
      message: "All File Found",
      allFiles,
    });
  } catch (error) {
    res.send(error);
  }
});

router.post(`/`, async (req, res) => {
  try {
    let newPaste = new Paste();
    let newfile = new File();

    newPaste.author = req.body.author;
    newPaste.title = req.body.title;
    newPaste.language = req.body.language;
    newPaste.status = req.body.status;
    newPaste.pasteText = req.body.pasteText;

    newfile.name = req.body.title + ".txt";
    newfile.data = Buffer.from(req.body.pasteText);
    const savedFile = await newfile.save();
    newPaste.pasteFileId = savedFile._id;

    const pasteKey = urlShortener(4);
    newPaste.pasteKey = pasteKey;

    const savedPaste = await newPaste.save();
    res.json({
      message: "New Paste Been Added",
      data: savedPaste,
    });
  } catch (error) {
    res.send(error);
  }
});

router.get(`/:pasteKey`, cache, async (req, res) => {
  try {
    const onePaste = await Paste.findOne({
      pasteKey: req.params.pasteKey,
    });
    if (onePaste) {
      await client.setEx(req.params.pasteKey, 3600, JSON.stringify(onePaste));
      res.json({ message: "Paste been found have been found", data: onePaste });
    } else {
      res
        .status(404)
        .json({ message: `Paste ${req.params.pasteKey} doesn't exist` });
    }
  } catch (error) {
    res.send(error);
  }
});

router.post(`/file/download/:fileId`, async (req, res) => {
  try {
    const oneFile = await File.findOne({ _id: req.params.fileId });
    if (oneFile) {
      fs.writeFile(
        "C:/Users/HP/Downloads/" + oneFile.name,
        oneFile.data,
        (err) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: "File has been downloaded" });
          }
        }
      );
    } else {
      res
        .status(404)
        .json({ message: `File ${req.params.pasteKey} doesn't exist` });
    }
  } catch (error) {
    res.send(error);
  }
});

router.delete(`/:pasteKey`, async (req, res) => {
  try {
    const onePaste = await Paste.findOne({
      pasteKey: req.params.pasteKey,
    });
    if (onePaste) {
      await Paste.deleteOne({
        pasteKey: req.params.pasteKey,
      });
      await client.del(req.params.pasteKey);
      res.json({ message: `Paste ${req.params.pasteKey} has been deleted` });
    } else {
      res
        .status(400)
        .json({ message: `Paste ${req.params.pasteKey} doesn't exist` });
    }
  } catch (error) {
    res.send(error);
  }
});

router.delete(`/`, async (req, res) => {
  try {
    await Paste.deleteMany({});
    await client.del("pasteData");
    res.json({ message: "All Paste has been deleted" });
  } catch (error) {
    res.send(error);
  }
});

router.delete(`/file/all`, async (req, res) => {
  try {
    await File.deleteMany({});
    res.json({ message: "All File has been deleted" });
  } catch (error) {
    res.send(error);
  }
});

// //cron job every month
// cron.schedule("0 10 1 * *", () => {
//   addShortUrls();
// });

export default router;
