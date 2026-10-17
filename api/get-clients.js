import { sql } from "../src/lib/db.js";

export default async function handler(req, res) {
  try {
    const clients = await sql`
      SELECT id, name, email, created_at, last_login
      FROM users
      WHERE user_type = 'Client'
      ORDER BY created_at DESC
    `;
    return res.status(200).json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    return res.status(500).json({ error: err.message });
  }
}
