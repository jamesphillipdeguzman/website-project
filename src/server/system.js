import { Client } from "@neondatabase/serverless";
import { sql, getCleanDatabaseUrl } from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Handle system-status
 */
export async function handleSystemStatus(req, res) {
  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!cleanUrl) {
    return res.status(200).json({
      status: "degraded",
      message: "No database connection string configured",
    });
  }

  const client = new Client({
    connectionString: cleanUrl,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");

    return res.status(200).json({
      status: "operational",
      message: "All systems operational",
    });
  } catch (err) {
    console.error("System status error:", err);

    return res.status(200).json({
      status: "degraded",
      message: "Database connectivity issue",
    });
  } finally {
    await client.end();
  }
}

/**
 * Handle get-clients
 */
export async function handleGetClients(req, res) {
  try {
    const clients = await sql`
      SELECT id, name, email, created_at, last_login
      FROM users
      WHERE user_type = 'Client'
      ORDER BY created_at DESC
    `;
    return res.status(200).json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Handle new-leads
 */
export async function handleNewLeads(req, res) {
  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!cleanUrl) {
    return res.status(200).json({ newLeads: 0 });
  }

  const client = new Client({
    connectionString: cleanUrl,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE user_type = 'Client'
        AND last_login >= NOW() - INTERVAL '7 days'
    `);

    return res.status(200).json({
      newLeads: Number(result.rows[0]?.count || 0),
    });
  } catch (err) {
    console.warn("New leads error:", err.message);
    return res.status(200).json({ newLeads: 0 });
  } finally {
    try {
      await client.end();
    } catch {}
  }
}

/**
 * Handle query-db
 */
export async function handleQueryDb(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const query = body.query || "SELECT NOW()";

    const connectionString = getCleanDatabaseUrl(
      process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL
    );

    if (!connectionString) {
      return res.status(500).json({
        error: "No database connection string found in environment variables.",
      });
    }

    const client = new Client({ connectionString });
    await client.connect();

    const result = await client.query(query);
    await client.end();

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error occurred:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handle POST /api/reviews
 * Accepts { portfolio_name, rating, feedback, author_name }
 */
export async function handleReview(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const portfolio_name = (
      body.portfolio_name ||
      body.portfolioName ||
      body.portfolio ||
      body["dynamic-product"] ||
      ""
    ).trim();
    const feedback = (
      body.feedback ||
      body.comments ||
      body.review ||
      body["written-review"] ||
      ""
    ).trim();
    const author_name = (
      body.author_name ||
      body.name ||
      body.fname ||
      "Anonymous"
    ).trim();

    // Validate rating: integer between 1 and 5
    const rawRating = body.rating !== undefined ? body.rating : body.stars;
    const rating = Number(rawRating);

    if (isNaN(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be an integer between 1 and 5." });
    }

    if (!portfolio_name) {
      return res.status(400).json({ error: "Portfolio name is required." });
    }

    const connectionString = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    if (connectionString) {
      const client = new Client({ connectionString });
      await client.connect();

      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            portfolio_name VARCHAR(255),
            rating INT,
            feedback TEXT,
            author_name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Ensure target columns exist if table was previously created with alternative columns
        await client.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS portfolio_name VARCHAR(255)`);
        await client.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INT`);
        await client.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS feedback TEXT`);
        await client.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS author_name VARCHAR(255)`);

        await client.query(
          `INSERT INTO reviews (portfolio_name, rating, feedback, author_name)
           VALUES ($1, $2, $3, $4)`,
          [portfolio_name, rating, feedback, author_name]
        );
      } finally {
        await client.end();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Review recorded successfully",
      review: {
        portfolio_name,
        rating,
        feedback,
        author_name,
      },
    });
  } catch (error) {
    console.error("Error processing review:", error);
    return res.status(500).json({ error: error.message || "Failed to record review" });
  }
}

/**
 * Handle POST /api/quotes
 * Accepts { name, email, phone, question }
 */
export async function handleQuotes(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { name, email, phone, question, message, company_fax, extra_security_token } = body;
    const botField = body["bot-field"];

    // Honeypot / Bot Validation
    if (company_fax || botField || extra_security_token) {
      console.warn("Honeypot triggered on quote request. Silently discarding submission:", {
        email,
        company_fax,
        botField,
      });
      return res.status(200).json({
        success: true,
        message: "Quote request submitted successfully.",
      });
    }

    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim();
    const cleanPhone = (phone || "").trim();
    const cleanQuestion = (question || message || "").trim();

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const connectionString = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    if (connectionString) {
      const client = new Client({ connectionString });
      await client.connect();

      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS quotes (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(100),
            question TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Ensure columns exist
        await client.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS name VARCHAR(255)`);
        await client.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS email VARCHAR(255)`);
        await client.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS phone VARCHAR(100)`);
        await client.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS question TEXT`);

        await client.query(
          `INSERT INTO quotes (name, email, phone, question)
           VALUES ($1, $2, $3, $4)`,
          [cleanName, cleanEmail, cleanPhone, cleanQuestion]
        );
      } finally {
        await client.end();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Quote request submitted successfully.",
      quote: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        question: cleanQuestion,
      },
    });
  } catch (error) {
    console.error("Error processing quote:", error);
    return res.status(500).json({ error: error.message || "Failed to process quote request" });
  }
}

