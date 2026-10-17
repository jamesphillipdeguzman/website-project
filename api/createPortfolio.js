import { sql } from "../src/lib/db.js";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { title, description, category, project_link, github, image_url } = body;

    if (!title || !description || !image_url) {
      return res.status(400).json({
        error: "Title, description, and image_url are required",
      });
    }

    const result = await sql`
      INSERT INTO portfolios (title, description, category, project_link, github_link, image_url)
      VALUES (${title}, ${description}, ${category}, ${project_link || null}, ${github || null}, ${image_url})
      RETURNING *;
    `;

    return res.status(200).json({
      message: "Portfolio created successfully",
      portfolio: result[0],
    });
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return res.status(500).json({ error: error.message });
  }
}
