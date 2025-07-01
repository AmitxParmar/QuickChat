import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import pino from "pino";
import pinoHttp from "pino-http";
import socketHandler from "./socket.js";

dotenv.config();
const logger = pino();

const app = express();

app.use(
  pinoHttp({
    logger,
    customLogLevel: (res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        id: req.id,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} → ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `❌ ${req.method} ${req.url} → ${res.statusCode} — ${err.message}`,
  })
);

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/hello", (req, res) => {
  res.send("Hello");
});
app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images", express.static("uploads/images"));

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started running on port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);
