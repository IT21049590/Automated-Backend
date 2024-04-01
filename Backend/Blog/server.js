import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const filePath = fileURLToPath(import.meta.url);
const dirName = path.dirname(filePath);
const app = express();
const PORT = process.env.PORT || 8060;
app.use(express.static(path.join(dirName, "uploads")));

const filePath1 = fileURLToPath(import.meta.url);
const dirName1 = path.dirname(filePath1);
app.use(express.static(path.join(dirName1, "UploadUserPostImages")));

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log("***************************************");
  console.log(`Server Running on port number : ${PORT}`);
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MONGO_DB Connection successfull......!!");
  console.log("***************************************");
});

import blog from "./Routes/Blog-routes.js";
app.use("/Blog", blog);
