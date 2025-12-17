// netlify/functions/analytics.js
import { sql } from "../../src/lib/db.js";

export async function handler(event, context) {
  try {
    // Fetch latest 100 analytics events with visitor info
    const query = `
      SELECT 
        ae.created_at,
        COALESCE(v.name, 'Guest') AS visitor_name,
        ae.visitor_type,
        ae.page,
        ae.event_type,
        ae.referrer,
        ae.device
      FROM analytics_events ae
      LEFT JOIN visitors v ON ae.visitor_id = v.id
      ORDER BY ae.created_at DESC
      LIMIT 100;
    `;

    const rows = await sql.unsafe(query);

    return {
      statusCode: 200,
      body: JSON.stringify({ rows }),
    };
  } catch (err) {
    console.error("Analytics function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch analytics" }),
    };
  }
}
