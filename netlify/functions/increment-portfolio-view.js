import { Client } from "@neondatabase/serverless";
import { getCleanDatabaseUrl } from "../../src/lib/db.js";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    body = {};
  }

  const id = body.id || event.queryStringParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing portfolio id" }),
    };
  }

  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!cleanUrl) {
    console.error("Database connection failure: No DATABASE_URL configured for view increment.");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, views: 1 }),
    };
  }

  let client;
  try {
    client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;");
    } catch { }

    const numericId = Number(id);
    const targetId = isNaN(numericId) ? id : numericId;

    const { rows } = await client.query(
      `UPDATE portfolios 
       SET views = COALESCE(views, 0) + 1 
       WHERE id = $1 
       RETURNING views;`,
      [targetId]
    );

    const views = rows && rows.length > 0 ? Number(rows[0].views) : 1;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true, views }),
    };
  } catch (err) {
    console.error("Increment portfolio view error:", err);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, views: 1 }),
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch { }
    }
  }
}
