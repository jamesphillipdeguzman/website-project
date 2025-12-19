// netlify/functions/track-event.js
import { sql } from "../../src/lib/db.js";
import { randomUUID } from "crypto";

// Helper to normalize device names
const getDeviceName = (userAgent) => {
  if (!userAgent) return "Unknown";
  const ua = userAgent.toLowerCase();
  if (/mobile/i.test(ua) || /iphone/i.test(ua) || /android/i.test(ua))
    return "Mobile";
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  return "Desktop";
};

// Determine visitor type based on email or trackAdmin
const getVisitorType = (email, trackAdmin) => {
  if (trackAdmin) return "admin";
  if (email?.toLowerCase() === "jamesphillipdeguzman@gmail.com") return "admin";
  if (email?.toLowerCase() === "jamesphillipd@yahoo.com") return "client";
  return "guest";
};

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);

    // 1️⃣ Generate new visitor_id if not provided or empty
    const visitor_id = payload.visitor_id?.trim() || randomUUID();

    const {
      name,
      email,
      user_agent,
      page_url,
      page_title,
      referrer_url,
      screen_width,
      screen_height,
      language,
      event_type,
      event_payload,
      trackAdmin = false,
    } = payload;

    const device = getDeviceName(user_agent);
    const typeToLog = getVisitorType(email, trackAdmin);

    // 2️⃣ Upsert visitor (keep visitor_type intact)
    await sql`
      INSERT INTO visitors (id, name, email, visitor_type, first_seen, last_seen, session_count)
      VALUES (
        ${visitor_id},
        ${name || null},
        ${email || null},
        ${typeToLog},
        NOW(),
        NOW(),
        1
      )
      ON CONFLICT (id) DO UPDATE
      SET
        last_seen = NOW(),
        session_count = visitors.session_count + 1
    `;

    // 3️⃣ Insert analytics event
    await sql`
      INSERT INTO analytics_events (
        visitor_id, visitor_type, name, email,
        page_url, page_title, referrer_url, device,
        screen_width, screen_height, language,
        event_type, event_payload, created_at
      ) VALUES (
        ${visitor_id}, ${typeToLog}, ${name || null}, ${email || null},
        ${page_url}, ${page_title || null}, ${referrer_url || "Direct"}, ${device},
        ${screen_width || null}, ${screen_height || null}, ${language || null},
        ${event_type || "pageview"}, ${JSON.stringify(event_payload) || null}, NOW()
      )
    `;

    // 4️⃣ Return visitor_id so frontend can store it in localStorage
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, visitor_id }),
    };
  } catch (err) {
    console.error("Analytics function error:", err);
    return { statusCode: 500, body: err.message };
  }
};
