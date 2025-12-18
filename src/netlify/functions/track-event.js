// netlify/functions/track-event.js
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
      visitor_type,
      email = null,
      name = null,
      page_url = null,
      page_title = null,
      referrer_url = null,
      user_agent = null,
      screen_width = null,
      screen_height = null,
      language = null,
      event_type,
      event_payload = {},
    } = payload;

    if (!visitor_id) {
      throw new Error("visitor_id is required");
    }

    const safeVisitorType = (visitor_type || "unknown").slice(0, 50);
    const safeEventType = (event_type || "unknown").slice(0, 50);

    // ---------- Insert or update visitor ----------
    // Only updates last_seen and session_count to avoid overwriting visitor_type/email/name
    await sql`
      INSERT INTO visitors (id, visitor_type, email, name, first_seen, last_seen, session_count)
      VALUES (
        ${visitor_id},
        ${safeVisitorType},
        ${email},
        ${name},
        NOW(),
        NOW(),
        1
      )
      ON CONFLICT (id) DO UPDATE
      SET
        last_seen = NOW(),
        session_count = visitors.session_count + 1;
    `;

    // ---------- Optional: Skip admin events ----------
    // Only skip sending if visitor_type === "admin" AND the checkbox says false
    if (
      safeVisitorType === "admin" &&
      localStorage.getItem("trackAdmin") === "false"
    ) {
      console.log("Skipping admin tracking due to checkbox");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Admin tracking skipped" }),
      };
    }

    // ---------- Insert analytics event ----------
    await sql`
      INSERT INTO analytics_events
        (visitor_id, event_type, page_url, page_title, referrer_url, device, screen_width, screen_height, language, event_payload, created_at)
      VALUES
        (
          ${visitor_id},
          ${safeEventType},
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
