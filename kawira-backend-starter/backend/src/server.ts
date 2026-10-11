import "dotenv/config";
import express from "express";
import http from "node:http";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pool } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { chatRouter } from "./routes/chat.js";
import { mentoringRouter } from "./routes/mentoring.js";
import { adminRouter } from "./routes/admin.js";
import { attachSocketServer } from "./socket.js";

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 4000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "kawira-api" });
  } catch {
    res.status(503).json({ ok: false });
  }
});
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/mentoring-sessions", mentoringRouter);
app.use("/api/admin", adminRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("unhandled-request-error", err instanceof Error ? err.message : "unknown");
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

attachSocketServer(server, clientOrigin);
server.listen(port, () => console.log(`KAWIRA API listening on :${port}`));

process.on("SIGTERM", async () => {
  server.close();
  await pool.end();
  process.exit(0);
});
