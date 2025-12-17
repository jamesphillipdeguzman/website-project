import { sql } from "../../src/lib/db.js";
import dotenv from "dotenv";

dotenv.config();

export async function handler(event) {
  try {
    if (event.httpMethod !== "PUT") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const { id } = event.queryStringParameters;
    const {
      title,
      description,
      category,
      project_link,
      github_link,
      image_url,
    } = JSON.parse(event.body);

    if (!id || !title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Portfolio ID, title, and description are required",
        }),
      };
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
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Portfolio not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Portfolio updated successfully",
        portfolio: result[0],
      }),
    };
  } catch (error) {
    console.error("Portfolio update error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
