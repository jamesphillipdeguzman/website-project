// netlify/functions/track-event.js
import { sql } from "../../src/lib/db.js";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    const {
      visitor_id,
      visitor_type,
      email,
      name,
      page_url,
      page_title,
      referrer_url,
      user_agent,
      screen_width,
      screen_height,
      language,
      event_type,
      event_payload,
    } = body;

    // Insert into analytics_events
    const insertQuery = `
      INSERT INTO analytics_events (
        visitor_id,
        visitor_type,
        email,
        name,
        page_url,
        page_title,
        referrer_url,
        user_agent,
        screen_width,
        screen_height,
        language,
        event_type,
        event_payload,
        created_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW()
      )
      RETURNING id;
    `;

    const values = [
      visitor_id,
      visitor_type,
      email || null,
      name || null,
      page_url,
      page_title,
      referrer_url || null,
      user_agent,
      screen_width,
      screen_height,
      language,
      event_type,
      JSON.stringify(event_payload || {}),
    ];

    const result = await sql.unsafe(insertQuery, values);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: result[0].id }),
    };
  } catch (err) {
    console.error("Analytics insert error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
