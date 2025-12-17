import { sql } from "../../src/lib/db.js";

export async function handler() {
  try {
    await sql`
      UPDATE site_visits
      SET count = count + 1
      WHERE id = 1;
    `;

    return {
      statusCode: 204, // No content needed
    };
  } catch (err) {
    console.error("❌ Increment visit error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to increment visit" }),
    };
  }
}
