// netlify/functions/analytics.js
import { sql } from "../../src/lib/db.js"; // your Neon helper

export async function handler(event, context) {
  try {
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);

      const {
        visitor_id,
        visitor_type,
        email,
        name,
        page_url,
        event_type,
        referrer_url,
        user_agent,
      } = body;

      // 1️⃣ Upsert visitor
      await sql`
        INSERT INTO visitors (id, visitor_type, email, name)
        VALUES (${visitor_id}, ${visitor_type}, ${email || null}, ${name || null})
        ON CONFLICT (id) DO UPDATE
        SET last_seen = now(),
            session_count = visitors.session_count + 1;
      `;

      // 2️⃣ Insert analytics event
      await sql`
        INSERT INTO analytics_events (visitor_id, page, event_type, referrer, device)
        VALUES (
          ${visitor_id},
          ${page_url},
          ${event_type},
          ${referrer_url || "Direct"},
          ${user_agent || "Unknown"}
        )
      `;

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    console.error("Analytics function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
