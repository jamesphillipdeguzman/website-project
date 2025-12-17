// functions/get-portfolios.js
import { sql } from "../../src/lib/db.js"; // your Neon helper

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const portfolios = await sql`
      SELECT id, title, description, image_url, project_link, github_link
      FROM portfolios 
      ORDER BY id ASC;
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(portfolios),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database error" }),
    };
  }
}
