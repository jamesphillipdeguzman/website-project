import { sql } from "../src/lib/db.js";

export default async function handler(req, res) {
  try {
    await sql`
      UPDATE site_visits
      SET count = count + 1
      WHERE id = 1;
    `;

    return res.status(204).end();
  } catch (err) {
    console.error("❌ Increment visit error:", err);
    return res.status(500).json({ error: "Failed to increment visit" });
  }
}
