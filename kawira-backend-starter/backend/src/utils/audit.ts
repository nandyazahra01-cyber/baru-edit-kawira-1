import type { Request } from "express";
import { pool } from "../db.js";

export async function audit(
  req: Request,
  action: string,
  description = "",
  status: "success" | "failure" = "success",
  metadata: Record<string, unknown> = {}
) {
  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, role, action, description, ip_address, user_agent, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
      [
        req.user?.id ?? null,
        req.user?.role ?? null,
        action,
        description.slice(0, 500),
        req.ip ?? null,
        req.get("user-agent")?.slice(0, 500) ?? null,
        status,
        JSON.stringify(metadata)
      ]
    );
  } catch (error) {
    // Jangan bocorkan detail internal ke response. Integrasikan logger/alerting pada deployment.
    console.error("audit-write-failed", error instanceof Error ? error.message : "unknown");
  }
}
