import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import articlesRouter from "./routes/articles";
import contactRouter from "./routes/contact";
import commentsRouter from "./routes/comments";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Articles routes
  app.use("/api/articles", articlesRouter);

  // Contact routes
  app.use("/api/contact", contactRouter);

  // Comments routes
  app.use("/api/comments", commentsRouter);

  return app;
}
