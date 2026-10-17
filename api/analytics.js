import { sql } from "../src/lib/db.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed");
    }

    const analytics = await sql`
      SELECT *
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    return res.status(200).json(analytics);
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
    return res.status(500).json({ error: err.message });
  }
}
