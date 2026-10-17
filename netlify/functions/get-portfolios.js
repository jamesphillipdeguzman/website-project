// functions/get-portfolios.js
import { sql } from "../../src/lib/db.js";
import { DEFAULT_PORTFOLIOS } from "../../src/server/portfolios.js";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    if (!sql) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_PORTFOLIOS),
      };
    }

    const portfolios = await sql`
      SELECT id, title, description, category, image_url, project_link, github_link, COALESCE(views, 0) AS views
      FROM portfolios 
      ORDER BY id ASC;
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(portfolios && portfolios.length > 0 ? portfolios : DEFAULT_PORTFOLIOS),
    };
  } catch (err) {
    console.error("Database fetch error in get-portfolios function:", err);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DEFAULT_PORTFOLIOS),
    };
  }
}
