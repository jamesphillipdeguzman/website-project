// functions/get-portfolios.js
import { sql } from "../../src/lib/db.js";
import { DEFAULT_PORTFOLIOS } from "../../src/server/portfolios.js";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    if (!sql) {
      console.error("Database connection failure: SQL client not initialized in get-portfolios.");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_PORTFOLIOS),
      };
    }

    const portfolios = await sql`
      SELECT id, title, description, category, image_url, live_url, github_url, COALESCE(views, 0) AS views 
      FROM portfolios 
      ORDER BY id DESC;
    `;

    const rows = (portfolios || []).map((row) => ({
      ...row,
      project_link: row.project_link || row.live_url || "#",
      live_url: row.live_url || row.project_link || "#",
      github_link: row.github_link || row.github_url || "",
      github_url: row.github_url || row.github_link || "",
      views: Number(row.views) || 0,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows && rows.length > 0 ? rows : DEFAULT_PORTFOLIOS),
    };
  } catch (err) {
    console.error("Database connection failure / query error in get-portfolios function:", err);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DEFAULT_PORTFOLIOS),
    };
  }
}
