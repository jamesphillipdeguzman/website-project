import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

export async function handler() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Simple DB ping
    await client.query("SELECT 1");

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "operational",
        message: "All systems operational",
      }),
    };
  } catch (err) {
    console.error("System status error:", err);

    return {
      statusCode: 200, // still 200 so frontend can render
      body: JSON.stringify({
        status: "degraded",
        message: "Database connectivity issue",
      }),
    };
  } finally {
    await client.end();
  }
}
