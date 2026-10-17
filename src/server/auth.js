import { Client } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { getCleanDatabaseUrl } from "../lib/db.js";
dotenv.config();

/**
 * Handle user login
 */
export async function handleLogin(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const email = (body.email || "").trim();
  const password = body.password || "";

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!cleanUrl) {
    return res.status(500).json({ error: "Database configuration missing" });
  }

  const client = new Client({ connectionString: cleanUrl });

  try {
    await client.connect();

    // Query user by case-insensitive email
    const result = await client.query(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1)) LIMIT 1;",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Flexible password verification
    let isPasswordMatch = false;

    if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$"))) {
      // Hashed password
      isPasswordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Plain text fallback
      isPasswordMatch = (user.password === password);
    }

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Update last_login
    try {
      await client.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
        user.id,
      ]);
    } catch (loginErr) {
      console.warn("Could not update last_login timestamp:", loginErr.message);
    }

    // Successful login
    return res.status(200).json({
      success: true,
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
    try {
      await client.end();
    } catch {}
  }
}

/**
 * Helper to detect random bot generated names
 */
function isBotName(name) {
  if (!name || typeof name !== "string") return true;
  const clean = name.trim();
  if (clean.length < 2 || clean.length > 70) return true;

  // Must contain at least one vowel
  if (!/[aeiouy]/i.test(clean)) return true;

  // Reject continuous strings with no spaces longer than 15 chars lacking double vowels
  if (!clean.includes(" ") && clean.length > 15 && !/[aeiouy]{2,}/i.test(clean)) {
    return true;
  }

  // Reject long continuous words with 6 or more consecutive consonants
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(word)) {
      return true;
    }
  }

  // Reject high-entropy alternating mixed case spam with no spaces (e.g. jCUmyYdJFPJalZbEchMS)
  if (!clean.includes(" ") && clean.length >= 12) {
    const caseFlips = (clean.match(/([a-z][A-Z]|[A-Z][a-z])/g) || []).length;
    if (caseFlips >= 4) return true;
  }

  return false;
}

/**
 * Handle user registration with anti-bot defense
 */
export async function handleRegister(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const { name, email, password, user_type, company_fax, extra_security_token, form_start_time } = body;

  // 1. Honeypot Trap: Silent discard if bot filled hidden field
  if (company_fax || extra_security_token) {
    console.warn("Honeypot trap triggered by automated bot. Silently discarding submission:", { email, company_fax });
    return res.status(200).json({ success: true, message: "User registered successfully" });
  }

  // 2. Time-to-Submit Guard: Humans take at least 2 seconds
  if (form_start_time) {
    const elapsed = Date.now() - Number(form_start_time);
    if (!isNaN(elapsed) && elapsed < 2000) {
      console.warn("Bot rejected: Form submitted in under 2 seconds:", `${elapsed}ms`);
      return res.status(400).json({ error: "Form submission too fast. Please try again." });
    }
  }

  // 3. Email Pattern Guard: Reject burner emails with more than 2 dots in local part
  if (email && typeof email === "string") {
    const localPart = email.split("@")[0] || "";
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount > 2) {
      console.warn("Bot rejected: Dotted burner email detected:", email);
      return res.status(400).json({ error: "Invalid email address format." });
    }
  }

  // 4. Name Pattern Guard: Reject random alphanumeric strings without vowels or spaces
  if (isBotName(name)) {
    console.warn("Bot rejected: Random spam name pattern detected:", name);
    return res.status(400).json({ error: "Please enter a valid full name." });
  }

  const client = new Client({ connectionString: getCleanDatabaseUrl(process.env.DATABASE_URL) });

  try {
    await client.connect();

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      `INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4)`,
      [name.trim(), email.trim().toLowerCase(), hashedPassword, user_type ?? "Client"]
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
    const client = new Client({ connectionString: getCleanDatabaseUrl(process.env.DATABASE_URL) });
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

/**
 * Handle purging existing bot records from users/clients table
 */
export async function handlePurgeBots(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const client = new Client({ connectionString: getCleanDatabaseUrl(process.env.DATABASE_URL) });

  try {
    await client.connect();

    const deleteQuery = `
      DELETE FROM users 
      WHERE (
        email ~* '^[a-z0-9]+\\.[a-z0-9]+\\.[a-z0-9]+\\.[a-z0-9]+'
        OR (LENGTH(name) > 15 AND name !~* '[aeiouy]{2,}')
        OR (name ~* '^[a-zA-Z0-9]{12,}$' AND name !~* '\\s')
        OR (LENGTH(name) >= 10 AND name !~* '[aeiouy]')
      )
      AND (user_type = 'Client' OR user_type IS NULL)
      RETURNING id, name, email;
    `;

    const result = await client.query(deleteQuery);

    return res.status(200).json({
      success: true,
      message: `Successfully purged ${result.rowCount} bot records.`,
      purgedCount: result.rowCount,
      purgedUsers: result.rows,
    });
  } catch (error) {
    console.error("Purge error:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}

export { handleGetClients } from "./system.js";

