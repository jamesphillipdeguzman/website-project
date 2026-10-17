import { sql } from "../src/lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const portfolios = await sql`
      SELECT id, title, description, category, image_url, project_link, github_link
      FROM portfolios 
      ORDER BY id ASC;
    `;

    return res.status(200).json(portfolios);
  } catch (err) {
    console.error("Portfolios error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}
