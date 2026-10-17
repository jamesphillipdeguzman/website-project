import { Client } from "@neondatabase/serverless";
import { sql } from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Handle system-status
 */
export async function handleSystemStatus(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
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
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
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
      newLeads: Number(result.rows[0].count),
    });
  } catch (err) {
    console.error("New leads error:", err);
    return res.status(500).json({ error: "Failed to fetch new leads" });
  } finally {
    await client.end();
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

    const connectionString =
      process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

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
    const { name, rating, stars, comments, review, portfolioId, portfolioName, features, date } = body;

    const reviewData = {
      name: (name || body.fname || "Anonymous").trim(),
      rating: Number(rating || stars) || 5,
      comments: (comments || review || body["written-review"] || "").trim(),
      portfolio: (portfolioName || portfolioId || body["dynamic-product"] || "").trim(),
      features: Array.isArray(features) ? features : (features ? [features] : []),
      date: date || body["date-installed"] || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    console.log("New review received:", JSON.stringify(reviewData));

    // Optional DB persistence
    const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    if (connectionString) {
      try {
        const client = new Client({ connectionString });
        await client.connect();

        await client.query(`
          CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            rating INT,
            comments TEXT,
            portfolio VARCHAR(255),
            features TEXT,
            date VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await client.query(
          `INSERT INTO reviews (name, rating, comments, portfolio, features, date)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            reviewData.name,
            reviewData.rating,
            reviewData.comments,
            reviewData.portfolio,
            reviewData.features.join(", "),
            reviewData.date,
          ]
        );
        await client.end();
      } catch (dbErr) {
        console.warn("Could not insert review to DB, logging instead:", dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Review recorded",
      review: reviewData,
    });
  } catch (error) {
    console.error("Error processing review:", error);
    return res.status(500).json({ error: "Failed to record review" });
  }
}

