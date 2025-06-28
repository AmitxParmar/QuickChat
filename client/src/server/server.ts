import { Server } from "socket.io";
import express, { Request, Response } from "express";
import { createServer } from "http";
import next from "next";
import AuthRoutes from "./routes/AuthRoutes";
import MessageRoutes from "./routes/MessageRoutes";
import socketHandler from "./socket";
import cors from "cors";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  // CORS setup
  /* server.use(cors()); */
  // Custom Express routes
  server.use(cors());
  server.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello from Express!" });
  });

  // Handle all other routes with Next.js
  server.get("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.use(express.json());

  server.use("/uploads/recordings", express.static("uploads/recordings"));
  server.use("/uploads/images", express.static("uploads/images"));

  server.use("/api/auth", AuthRoutes);
  server.use("/api/messages", MessageRoutes);

  const PORT = process.env.PORT || 3000;

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // handle socket events
  socketHandler(io);

  server.listen(PORT, (err: Error) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
