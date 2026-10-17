import { sql } from "../src/lib/db.js";

export default async function handler(req, res) {
  try {
    await sql`TRUNCATE TABLE analytics_events RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE visitors RESTART IDENTITY CASCADE;`;

    return res.status(200).json({
      message: "Analytics and visitors cleared successfully.",
    });
  } catch (err) {
    console.error("Error clearing analytics:", err);
    return res.status(500).json({ error: err.message });
  }
}
