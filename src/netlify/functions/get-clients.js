// netlify/functions/get-clients.js
import { sql } from "../../src/lib/db.js";

export const handler = async () => {
  try {
    const clients = await sql`
      SELECT id, name, email, created_at, last_login
      FROM users
      WHERE user_type = 'Client'
      ORDER BY created_at DESC
    `;
    return {
      statusCode: 200,
      body: JSON.stringify(clients),
    };
  } catch (err) {
    console.error("Error fetching clients:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
