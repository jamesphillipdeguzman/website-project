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
      SELECT COUNT(*) AS count
      FROM users
      WHERE user_type = 'Client'
        AND last_login >= NOW() - INTERVAL '7 days'
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({
        newLeads: Number(result.rows[0].count),
      }),
    };
  } catch (err) {
    console.error("New leads error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch new leads" }),
    };
  } finally {
    await client.end();
  }
}
