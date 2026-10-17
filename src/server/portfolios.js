import { sql } from "../lib/db.js";
import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

/**
 * Handle get-portfolios
 * Accommodates 'views' column (default 0)
 */
export async function handleGetPortfolios(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // Ensure views column exists if not already present in the database
    try {
      await sql`ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;`;
    } catch {
      // Ignore if table/column already exists or user has restricted permissions
    }

    let portfolios;
    try {
      portfolios = await sql`
        SELECT id, title, description, category, image_url, project_link, github_link, COALESCE(views, 0) AS views
        FROM portfolios 
        ORDER BY id ASC;
      `;
    } catch {
      // Fallback query if column hasn't propagated yet
      portfolios = await sql`
        SELECT id, title, description, category, image_url, project_link, github_link
        FROM portfolios 
        ORDER BY id ASC;
      `;
      portfolios = portfolios.map((p) => ({ ...p, views: p.views ?? 0 }));
    }

    return res.status(200).json(portfolios);
  } catch (err) {
    console.error("Portfolios error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}

/**
 * Atomically increment a portfolio item's view count
 */
export async function handleIncrementPortfolioView(req, res) {
  const id = req.query?.id || (req.body && req.body.id);
  if (!id) {
    return res.status(400).json({ error: "Portfolio ID is required" });
  }

  try {
    try {
      await sql`ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;`;
    } catch {
      // Ignore
    }

    const result = await sql`
      UPDATE portfolios
      SET views = COALESCE(views, 0) + 1
      WHERE id = ${id}
      RETURNING id, views;
    `;

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    return res.status(200).json({
      success: true,
      id: result[0].id,
      views: result[0].views,
    });
  } catch (err) {
    console.error("Increment portfolio view error:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Handle createPortfolio
 */
export async function handleCreatePortfolio(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { title, description, category, project_link, github, image_url } = body;

    if (!title || !description || !image_url) {
      return res.status(400).json({
        error: "Title, description, and image_url are required",
      });
    }

    try {
      await sql`ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;`;
    } catch {
      // Ignore
    }

    const result = await sql`
      INSERT INTO portfolios (title, description, category, project_link, github_link, image_url, views)
      VALUES (${title}, ${description}, ${category}, ${project_link || null}, ${github || null}, ${image_url}, 0)
      RETURNING *;
    `;

    return res.status(200).json({
      message: "Portfolio created successfully",
      portfolio: result[0],
    });
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handle updatePortfolio
 */
export async function handleUpdatePortfolio(req, res) {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const id = req.query?.id;
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const {
      title,
      description,
      category,
      project_link,
      github_link,
      image_url,
    } = body;

    if (!id || !title || !description) {
      return res.status(400).json({
        error: "Portfolio ID, title, and description are required",
      });
    }

    const result = await sql`
      UPDATE portfolios
      SET 
        title = ${title},
        description = ${description},
        category = ${category},
        project_link = ${project_link || null},
        github_link = ${github_link || null},
        ${image_url ? sql`image_url = ${image_url}` : sql``}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!result[0]) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    return res.status(200).json({
      message: "Portfolio updated successfully",
      portfolio: result[0],
    });
  } catch (error) {
    console.error("Portfolio update error:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handle last-project
 */
export async function handleLastProject(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT title, created_at
      FROM portfolios
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(200).json({ project: null });
    }

    return res.status(200).json({
      project: result.rows[0],
    });
  } catch (err) {
    console.error("Last project error:", err);
    return res.status(500).json({ error: "Failed to fetch last project" });
  } finally {
    await client.end();
  }
}
