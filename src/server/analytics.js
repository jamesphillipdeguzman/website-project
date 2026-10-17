import { Client } from "@neondatabase/serverless";
import { getCleanDatabaseUrl } from "../lib/db.js";

/**
 * Handle POST /api/record-event (and POST /api/track-event)
 * Accepts { name, type, page, event, referrer, device }
 */
export async function handleRecordEvent(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const name = (body.name || body.user_name || "Anonymous").trim();
    const role = (body.role || body.user_role || body.user_type || "").trim();
    const isAdmin =
      name === "James" ||
      role === "Admin" ||
      (name && name.toLowerCase().includes("james")) ||
      (role && role.toLowerCase() === "admin");
    const allowAdminTracking = body.allowAdminTracking === true || body.allowAdminTracking === "true";

    // Safeguard: do not insert admin event unless explicitly opted in
    if (isAdmin && !allowAdminTracking) {
      return res.status(200).json({ success: true, message: "Admin event tracking suppressed." });
    }

    const type = (body.type || body.visitor_type || "navigation").trim();
    const page = (body.page || body.page_url || "/").trim();
    const event = (body.event || body.event_type || "pageview").trim();
    const referrer = (body.referrer || body.referrer_url || "Direct").trim();

    let device = body.device;
    if (!device) {
      const ua = (body.user_agent || req.headers["user-agent"] || "").toLowerCase();
      if (/mobile|android|iphone/i.test(ua)) device = "Mobile";
      else if (/ipad|tablet/i.test(ua)) device = "Tablet";
      else device = "Desktop";
    }

    const cleanUrl = getCleanDatabaseUrl(
      process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL
    );

    if (cleanUrl) {
      const client = new Client({ connectionString: cleanUrl });
      await client.connect();

      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS analytics (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            type VARCHAR(100),
            page VARCHAR(255),
            event VARCHAR(100),
            referrer VARCHAR(255),
            device VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        await client.query(
          `INSERT INTO analytics (name, type, page, event, referrer, device) 
           VALUES ($1, $2, $3, $4, $5, $6);`,
          [name, type, page, event, referrer, device]
        );
      } finally {
        await client.end();
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error recording analytics event:", err);
    return res.status(200).json({ success: false, error: err.message });
  }
}

export const handleTrackEvent = handleRecordEvent;

/**
 * Handle GET /api/analytics (and GET /api/get-analytics)
 * Returns the latest 100 analytics events
 */
export async function handleGetAnalytics(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const cleanUrl = getCleanDatabaseUrl(
    process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL
  );

  if (!cleanUrl) {
    return res.status(200).json([]);
  }

  let client;
  try {
    client = new Client({ connectionString: cleanUrl });
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        type VARCHAR(100),
        page VARCHAR(255),
        event VARCHAR(100),
        referrer VARCHAR(255),
        device VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const { rows } = await client.query(`
      SELECT id, created_at AS date, name, type, page, event, referrer, device 
      FROM analytics 
      ORDER BY created_at DESC 
      LIMIT 100;
    `);

    return res.status(200).json(rows || []);
  } catch (err) {
    console.error("Get analytics error:", err);
    return res.status(200).json([]);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {}
    }
  }
}

/**
 * Handle DELETE /api/analytics (and POST /api/clear-analytics)
 * Truncates the analytics table
 */
export async function handleClearAnalytics(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const cleanUrl = getCleanDatabaseUrl(
    process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL
  );

  if (!cleanUrl) {
    return res.status(200).json({ success: true, message: "Analytics cleared." });
  }

  let client;
  try {
    client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS analytics (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          type VARCHAR(100),
          page VARCHAR(255),
          event VARCHAR(100),
          referrer VARCHAR(255),
          device VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await client.query("TRUNCATE TABLE analytics;");
    } catch (qErr) {
      console.warn("Truncate analytics warning:", qErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Analytics cleared successfully.",
    });
  } catch (err) {
    console.error("Error clearing analytics:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {}
    }
  }
}

/**
 * Legacy visit handlers
 */
export async function handleGetVisitCount(req, res) {
  return res.status(200).json({ count: 0 });
}

export async function handleIncrementVisit(req, res) {
  return res.status(204).end();
}
