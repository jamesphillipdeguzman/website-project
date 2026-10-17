import { sql } from "../src/lib/db.js";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const id = req.query?.id;
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const {
      title,
      description,
      category,
      project_link,
      github_link,
      image_url,
    } = body;

    if (!id || !title || !description) {
      return res.status(400).json({
        error: "Portfolio ID, title, and description are required",
      });
    }

    const result = await sql`
      UPDATE portfolios
      SET 
        title = ${title},
        description = ${description},
        category = ${category},
        project_link = ${project_link || null},
        github_link = ${github_link || null},
        ${image_url ? sql`image_url = ${image_url}` : sql``}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!result[0]) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    return res.status(200).json({
      message: "Portfolio updated successfully",
      portfolio: result[0],
    });
  } catch (error) {
    console.error("Portfolio update error:", error);
    return res.status(500).json({ error: error.message });
  }
}
