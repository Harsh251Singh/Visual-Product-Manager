import mongoose from "mongoose";
import UserModel from "../model/UserModel.js";
import ImageModel from "../model/ImageModel.js";
import dotenv from "dotenv";

dotenv.config();

async function db() {
  console.log(process.env.MONGODB_URI);
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("MongoDB Connected.");
      })
      .catch((err) => {
        console.log("Error connecting to the database", err);
      });
  } catch (err) {
    console.log("Something is wrong", err);
  }
}

export default db;
