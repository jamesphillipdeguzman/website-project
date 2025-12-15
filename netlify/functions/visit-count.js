// netlify/functions/visit-count.js
import { sql } from "../../src/lib/db.js";

export async function handler() {
  try {
    // Increment or insert row 1
    const result = await sql`
      INSERT INTO site_visits (id, count)
      VALUES (1, 1)
      ON CONFLICT (id) DO UPDATE
      SET count = site_visits.count + 1
      RETURNING count;
    `;

    const count = result[0].count;
    console.log("🔹 Current site visit count:", count);

    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };
  } catch (err) {
    console.error("❌ Visit count error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update visit count" }),
    };
  }
}
