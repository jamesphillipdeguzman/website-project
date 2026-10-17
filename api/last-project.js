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
      SELECT title, created_at
      FROM portfolios
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(200).json({ project: null });
    }

    return res.status(200).json({
      project: result.rows[0],
    });
  } catch (err) {
    console.error("Last project error:", err);
    return res.status(500).json({ error: "Failed to fetch last project" });
  } finally {
    await client.end();
  }
}
