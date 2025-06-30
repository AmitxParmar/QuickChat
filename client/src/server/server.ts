import { Server } from "socket.io";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import next from "next";
import AuthRoutes from "./routes/AuthRoutes";
import MessageRoutes from "./routes/MessageRoutes";
import socketHandler from "./socket";
import cors from "cors";
import { parse as urlParse } from "url";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // Middleware order: CORS, JSON, static, routes, error
  server.use(
    cors({
      origin: "*", // or your frontend domain
    })
  );
  server.use(express.json());

  // Static file serving
  server.use("/uploads/recordings", express.static("uploads/recordings"));
  server.use("/uploads/images", express.static("uploads/images"));

  // API routes
  server.use("/api/auth", AuthRoutes);
  server.use("/api/messages", MessageRoutes);

  // Example API route
  server.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello from Express!" });
  });

  // Improved custom handler for all other requests (Next.js pages, etc)
  server.all("*", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedUrl = urlParse(req.url || "", false);
      const pathname = parsedUrl.pathname || "/";

      // ✅ Replace querystring with URLSearchParams
      const queryParams = new URLSearchParams(parsedUrl.query || "");
      const query = Object.fromEntries(queryParams.entries());

      // 🔍 Extract current route from referer
      const referer = req.headers.referer ?? "";
      const host = req.headers.host ?? "";
      const curRoute = referer.includes(host)
        ? referer.split(host)[1] || ""
        : "";

      // 📊 Example: generate stats if on homepage
      if (curRoute === "/") {
        // Node server-side events
        // ...
      }

      // 🧭 Custom routing
      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, { ...parsedUrl, query });
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Error handler should be last
  server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).send("Something broke!");
  });

  const PORT = process.env.PORT || 3000;

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  // handle socket events
  socketHandler(io);
  httpServer.listen(PORT, (err?: Error) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
