import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Simple DB ping
    await client.query("SELECT 1");

    return res.status(200).json({
      status: "operational",
      message: "All systems operational",
    });
  } catch (err) {
    console.error("System status error:", err);

    return res.status(200).json({
      status: "degraded",
      message: "Database connectivity issue",
    });
  } finally {
    await client.end();
  }
}
