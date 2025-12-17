import { sql } from "../../src/lib/db.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405 };
  }

  const data = JSON.parse(event.body || "{}");

  try {
    // 1️⃣ Upsert visitor
    const visitor = await sql`
      INSERT INTO visitors (visitor_type, email, name)
      VALUES (${data.visitor_type}, ${data.email || null}, ${data.name || null})
      ON CONFLICT (email)
      DO UPDATE SET last_seen = NOW()
      RETURNING id;
    `;

    const visitorId = visitor[0]?.id || null;

    // 2️⃣ Insert analytics event
    await sql`
      INSERT INTO analytics_events (
        event_type,
        visitor_id,
        page_url,
        page_title,
        referrer_url,
        user_agent,
        screen_width,
        screen_height,
        language,
        event_payload
      ) VALUES (
        ${data.event_type},
        ${visitorId},
        ${data.page_url},
        ${data.page_title},
        ${data.referrer_url},
        ${data.user_agent},
        ${data.screen_width},
        ${data.screen_height},
        ${data.language},
        ${JSON.stringify(data.event_payload || {})}
      );
    `;

    return { statusCode: 200 };
  } catch (err) {
    console.error("Analytics error:", err);
    return { statusCode: 500 };
  }
}
