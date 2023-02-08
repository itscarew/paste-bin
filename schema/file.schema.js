import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FileSchema = new Schema({
  name: String,
  data: Buffer,
});

export default mongoose.model(`File`, FileSchema);
