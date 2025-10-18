import { Client } from "@neondatabase/serverless";
// import dotenv from "dotenv";
// dotenv.config();

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, password } = JSON.parse(event.body);
  debugger; // 🛑 VS Code will pause here when you call this function
  const client = new Client({ connectionString: process.env.NEON_DB_URL });

  try {
    await client.connect();
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const user = result.rows[0];

    // 🔑 Compare plain text password for now
    if (user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }

    // include the message in the response instead
    let message;
    if (user.user_type === "Admin") {
      message = "Hello there. You are an " + user.user_type;
    } else if (user.user_type === "Client") {
      message = "Welcome! You are logged in as a Client";
    } else {
      message = "Login successful";
    }
    // ✅ Success — send safe data only
    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
        userId: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type,
      }),
    };
  } catch (error) {
    console.error("❌ Login error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  } finally {
    await client.end();
  }
}
