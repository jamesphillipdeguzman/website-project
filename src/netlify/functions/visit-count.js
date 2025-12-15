// netlify/functions/visit-count.js
import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

export async function handler() {
  console.log("🔹 Visit-count function invoked"); // log function call

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✅ Connected to Neon DB");

    // Increment the counter in row id=1
    const res = await client.query(
      "UPDATE public.site_visits SET count = count + 1 WHERE id = 1 RETURNING count;",
    );

    if (res.rows.length === 0) {
      console.warn(
        "⚠️ No rows updated. Make sure the table has a row with id=1.",
      );
    } else {
      console.log("🔹 Updated count:", res.rows[0].count);
    }

    const count = res.rows[0]?.count || 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };
  } catch (err) {
    console.error("❌ Visit count error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update visit count" }),
    };
  } finally {
    await client.end();
    console.log("🔹 DB connection closed");
  }
}
