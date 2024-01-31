import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongo_url = process.env.MONGO_URL;
const db_name = process.env.DB_NAME;

export const dbConnect = mongoose
  .connect(mongo_url || " ", {
    dbName: db_name,
  })
  .then(() => {
    console.log("Connected to MongoDB Database");
  })
  .catch((err) => {
    console.log("Could not connect to database", err);
  });
