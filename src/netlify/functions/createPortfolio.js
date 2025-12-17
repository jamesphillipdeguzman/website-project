import { sql } from "../../src/lib/db.js";
import dotenv from "dotenv";

dotenv.config();

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const { title, description, category, project_link, github, image_url } =
      JSON.parse(event.body);

    if (!title || !description || !image_url) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Title, description, and image_url are required",
        }),
      };
    }

    const result = await sql`
      INSERT INTO portfolios (title, description, category, project_link, github_link, image_url)
      VALUES (${title}, ${description}, ${category}, ${project_link || null}, ${github || null}, ${image_url})
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Portfolio created successfully",
        portfolio: result[0],
      }),
    };
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
