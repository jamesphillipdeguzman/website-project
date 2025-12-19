// netlify/functions/login.js
import { Client } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, password } = JSON.parse(event.body);
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    // Fetch user by email
    const result = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()] // force lowercase for consistency
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    // Update last_login
    await client.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    // Successful login
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          user_type: user.user_type,
        },
      }),
    };
  } catch (error) {
    console.error("Login error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  } finally {
    await client.end();
  }
}
