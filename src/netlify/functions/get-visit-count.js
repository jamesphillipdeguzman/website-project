import { sql } from "../../src/lib/db.js";

export async function handler() {
  try {
    const result = await sql`
      SELECT count AS visit_count FROM site_visits WHERE id = 1;
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        count: result[0]?.visit_count ?? 0, // frontend still expects 'count'
      }),
    };
  } catch (err) {
    console.error("❌ Read visit count error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to read visit count" }),
    };
  }
}
