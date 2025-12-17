import { sql } from "../../src/lib/db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);
    console.log("Parsed payload:", payload);

    const {
      visitor_id,
      visitor_type = "guest",
      email = null,
      name = null,
      page_url = null,
      page_title = null,
      referrer_url = null,
      user_agent = null,
      screen_width = null,
      screen_height = null,
      language = null,
      event_type = "unknown",
      event_payload = {},
    } = payload;

    // ---------- Insert or update visitor ----------
    await sql`
      INSERT INTO visitors (id, visitor_type, email, name, first_seen, last_seen, session_count)
      VALUES (
        ${visitor_id}::uuid,
        ${visitor_type.slice(0, 50)},
        ${email},
        ${name},
        NOW(),
        NOW(),
        1
      )
      ON CONFLICT (id) DO UPDATE
      SET
        last_seen = NOW(),
        session_count = visitors.session_count + 1,
        visitor_type = EXCLUDED.visitor_type,
        email = EXCLUDED.email,
        name = EXCLUDED.name;
    `;

    // ---------- Insert analytics event ----------
    await sql`
      INSERT INTO analytics_events
        (visitor_id, event_type, page_url, page_title, referrer_url, device, screen_width, screen_height, language, event_payload, created_at)
      VALUES
        (
          ${visitor_id}::uuid,
          ${event_type.slice(0, 50)},
          ${page_url},
          ${page_title},
          ${referrer_url},
          ${user_agent},
          ${screen_width},
          ${screen_height},
          ${language},
          ${JSON.stringify(event_payload)},
          NOW()
        )
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event tracked" }),
    };
  } catch (err) {
    console.error("Analytics function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
