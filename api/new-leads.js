import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
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

    return res.status(200).json({
      newLeads: Number(result.rows[0].count),
    });
  } catch (err) {
    console.error("New leads error:", err);
    return res.status(500).json({ error: "Failed to fetch new leads" });
  } finally {
    await client.end();
  }
}
