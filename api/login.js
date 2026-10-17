import { Client } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const { email, password } = body;
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    // Fetch user by email
    const result = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email?.toLowerCase()] // force lowercase for consistency
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last_login
    await client.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    // Successful login
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}

export { handler };

