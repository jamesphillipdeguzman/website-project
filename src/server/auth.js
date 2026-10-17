import { Client } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

/**
 * Handle user login
 */
export async function handleLogin(req, res) {
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
      [email?.toLowerCase()]
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

/**
 * Handle user registration
 */
export async function handleRegister(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const { name, email, password, user_type } = body;

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      `INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4)`,
      [name, email, hashedPassword, user_type ?? "Client"]
    );

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}

/**
 * Handle get user by ID
 */
export async function handleGetUser(req, res) {
  const userId = req.query?.id || 1;

  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const result = await client.query("SELECT name FROM users WHERE id = $1", [
      userId,
    ]);
    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ name: null, message: "User not found" });
    }

    return res.status(200).json({ name: result.rows[0].name });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return res
      .status(500)
      .json({ name: null, message: "Internal Server Error" });
  }
}
