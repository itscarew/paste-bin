import { client } from "../index.js";
import Paste from "../schema/paste.schema.js";
import File from "../schema/file.schema.js";

export const deletePaste = async (pasteKey, pasteFileId, time) => {
  setTimeout(async () => {
    await Paste.deleteOne({
      pasteKey: pasteKey,
    });
    await client.del(pasteKey);
    await File.deleteOne({ _id: pasteFileId });
  }, time);
};
