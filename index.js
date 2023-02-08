import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import redis from "redis";
import pasteRoutes from "./routes/index.js";

const port = 5000;
const redisPort = 6379;

const app = express();
const db = `mongodb://127.0.0.1:27017/pasteBinDB`;
mongoose.connect(db);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/pasteBin", pasteRoutes);

export const client = redis.createClient(redisPort);

client.connect();
client.on("connected", () => console.log("Redis connected"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
