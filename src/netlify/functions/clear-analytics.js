// netlify/functions/clear-analytics.js
import { sql } from "../../src/lib/db.js";

export const handler = async () => {
  try {
    await sql`TRUNCATE TABLE analytics_events RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE visitors RESTART IDENTITY CASCADE;`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Analytics and visitors cleared successfully.",
      }),
    };
  } catch (err) {
    console.error("Error clearing analytics:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
