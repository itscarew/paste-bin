import mongoose from "mongoose";
import { deletePaste } from "../utils/deletePaste.js";

const Schema = mongoose.Schema;

const PasteSchema = new Schema(
  {
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      enum: [
        ".html",
        ".js",
        ".ts",
        ".css",
        ".txt",
        ".php",
        ".json",
        ".java",
        ".py",
        ".go",
      ],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["burn on reading", "keep forever", "1 hour", "1 day", "1 week"],
    },
    pasteText: {
      type: String,
      required: [true, "Text is required"],
    },
    pasteFileId: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    pasteKey: {
      type: String,
      required: [true, "Text is required"],
    },
  },
  { timestamps: true }
);

PasteSchema.post("save", async function (doc, next) {
  if (this.status === "1 hour") {
    deletePaste(this.pasteKey, this.pasteFileId, 3600000);
  } else if (this.status === "1 day") {
    deletePaste(this.pasteKey, this.pasteFileId, 86400000);
  } else if (this.status === "1 week") {
    deletePaste(this.pasteKey, this.pasteFileId, 604800000);
  } else {
    next();
  }
});

export default mongoose.model(`Paste`, PasteSchema);
