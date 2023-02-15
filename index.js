import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import redis from "redis";
import cors from "cors";
import pasteRoutes from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;
const redisPort =
  `redis://default:${process.env.REDISPASSWORD}@containers-us-west-44.railway.app:7090` ||
  6379;

const app = express();
const db = `mongodb+srv://itscarew:${process.env.DB_PASSWORD}@paste-bin-cluster.kd40cmy.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
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

client.on("error", (error) => {
  console.error(error);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
