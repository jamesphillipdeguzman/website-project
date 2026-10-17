import { sql } from "../lib/db.js";
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

/**
 * Handle track-event
 */
export async function handleTrackEvent(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
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

    // Upsert visitor
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

    // Insert analytics event
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

    return res.status(200).json({ success: true, visitor_id });
  } catch (err) {
    console.error("Analytics function error:", err);
    return res.status(500).send(err.message);
  }
}

/**
 * Handle get-analytics
 */
export async function handleGetAnalytics(req, res) {
  try {
    const events = await sql`
      SELECT id, visitor_id, visitor_type, name, email,
             page_url, page_title, referrer_url, device,
             event_type, created_at
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return res.status(200).json(events);
  } catch (err) {
    console.error("Get analytics error:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Handle clear-analytics
 */
export async function handleClearAnalytics(req, res) {
  try {
    await sql`TRUNCATE TABLE analytics_events RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE visitors RESTART IDENTITY CASCADE;`;

    return res.status(200).json({
      message: "Analytics and visitors cleared successfully.",
    });
  } catch (err) {
    console.error("Error clearing analytics:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Handle get-visit-count
 */
export async function handleGetVisitCount(req, res) {
  try {
    const result = await sql`
      SELECT count AS visit_count FROM site_visits WHERE id = 1;
    `;

    return res.status(200).json({
      count: result[0]?.visit_count ?? 0,
    });
  } catch (err) {
    console.error("❌ Read visit count error:", err);
    return res.status(500).json({ error: "Failed to read visit count" });
  }
}

/**
 * Handle increment-visit
 */
export async function handleIncrementVisit(req, res) {
  try {
    await sql`
      UPDATE site_visits
      SET count = count + 1
      WHERE id = 1;
    `;

    return res.status(204).end();
  } catch (err) {
    console.error("❌ Increment visit error:", err);
    return res.status(500).json({ error: "Failed to increment visit" });
  }
}
