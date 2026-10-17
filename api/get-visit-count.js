import { sql } from "../src/lib/db.js";

export default async function handler(req, res) {
  try {
    const result = await sql`
      SELECT count AS visit_count FROM site_visits WHERE id = 1;
    `;

    return res.status(200).json({
      count: result[0]?.visit_count ?? 0,
    });
  } catch (err) {
    console.error("❌ Read visit count error:", err);
    return res.status(500).json({ error: "Failed to read visit count" });
  }
}
