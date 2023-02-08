import cryptoRandomString from "crypto-random-string";
import { client } from "../index.js";
export const urlShortener = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const shortURL = cryptoRandomString({ length, characters });
  return shortURL;
};

//Cache MiddleWare
export const cache = async (req, res, next) => {
  try {
    const pasteKey = req.params.pasteKey;
    const cachedPaste = await client.get(pasteKey);
    if (cachedPaste !== null) {
      res.json({
        message: "One Paste have been found from redis",
        data: JSON.parse(cachedPaste),
      });
    } else {
      next();
    }
  } catch (error) {
    throw error;
  }
};
