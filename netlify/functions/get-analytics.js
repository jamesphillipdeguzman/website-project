// netlify/functions/get-analytics.js
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// Initialize PostgreSQL connection
const sql = postgres(process.env.DATABASE_URL);

export const handler = async (event) => {
  try {
    // Only allow GET requests
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    // Fetch all analytics events with visitor info
    const analytics = await sql`
  SELECT 
    ae.id,
    ae.visitor_id,
    v.name AS visitor_name,
    v.visitor_type,
    ae.event_type,
    ae.page_url,
    ae.page_title,
    ae.referrer_url,
    ae.device AS user_agent,
    ae.screen_width,
    ae.screen_height,
    ae.language,
    ae.event_payload,
    ae.created_at
  FROM analytics_events AS ae
  LEFT JOIN visitors AS v
  ON ae.visitor_id = v.id
  ORDER BY ae.created_at DESC
  LIMIT 100
`;

    return {
      statusCode: 200,
      body: JSON.stringify(analytics),
    };
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
