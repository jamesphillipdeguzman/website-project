import { sql } from "../../src/lib/db.js";

export const handler = async () => {
  try {
    const events = await sql`
      SELECT id, visitor_id, visitor_type, name, email,
             page_url, page_title, referrer_url, device,
             event_type, created_at
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(events),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
