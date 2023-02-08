import mongoose from "mongoose";

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
      enum: [".html", ".js", ".css", ".txt", ".php"],
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

export default mongoose.model(`Paste`, PasteSchema);
