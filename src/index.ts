import dotenv from "dotenv";
import express from "express";

import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
const app = express();

// Load environment variables
dotenv.config({ path: ".env" });

// Define env var interface
interface EnvironmentVariables {
  MONGO_KEY: string;
  // other environment variables as needed
}

const env = process.env as unknown as EnvironmentVariables;
const MONGO_URL: string = env.MONGO_KEY;

app.use("/api/v1", authRoutes);

app.use(
  cors({
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyparser.json());
// Error handling:: ->

app.listen(process.env.PORT, () => {
  console.log(`Server running: ${process.env.PORT} Port`);
});

mongooseConnection().catch((e) => {
  console.log(e);
});

async function mongooseConnection(): Promise<void> {
  if (MONGO_URL === "") {
    throw new Error("MONGO_KEY is not defined in the environment");
  }
  console.log(
    MONGO_URL,
    "mongooooodb ostringngggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
  );
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}
