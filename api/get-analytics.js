import { sql } from "../src/lib/db.js";

export default async function handler(req, res) {
  try {
    const events = await sql`
      SELECT id, visitor_id, visitor_type, name, email,
             page_url, page_title, referrer_url, device,
             event_type, created_at
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return res.status(200).json(events);
  } catch (err) {
    console.error("Get analytics error:", err);
    return res.status(500).json({ error: err.message });
  }
}
