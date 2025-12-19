// netlify/functions/analytics.js
import { sql } from "../../src/lib/db.js";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const analytics = await sql`
      SELECT *
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(analytics),
    };
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
