import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

export async function handler() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT title, created_at
      FROM portfolios
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ project: null }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        project: result.rows[0],
      }),
    };
  } catch (err) {
    console.error("Last project error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch last project" }),
    };
  } finally {
    await client.end();
  }
}
