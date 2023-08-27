import dotenv from "dotenv";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";

dotenv.config({ path: ".env" });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());

app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});

// Load environment variables
app.use("/api/v1", authRoutes);

const whitelist = ["http://localhost:3000", "http://localhost:8000"];

// Define env var interface
interface EnvironmentVariables {
  MONGO_KEY: string;
  // other environment variables as needed
}

const env = process.env as unknown as EnvironmentVariables;
const MONGO_URL: string = env.MONGO_KEY;

app.options("*", cors());

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Error handling:: ->
const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`Server running: ${process.env.PORT} Port`);
});

mongooseConnection().catch(e => {
  console.log("catch mongo Errors:", e);
});

async function mongooseConnection(): Promise<void> {
  if (MONGO_URL === "") {
    throw new Error("MONGO_KEY is not defined in the environment");
  }
  console.log(MONGO_URL, "mongooooodb ostringnggggggggggggggggggggggggggg");
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(error => {
      console.error("Error connecting to MongoDB:", error);
    });
}
