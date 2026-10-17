import { sql, getCleanDatabaseUrl } from "../lib/db.js";
import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

export const DEFAULT_PORTFOLIOS = [
  {
    id: 1,
    title: "Place page",
    pTitle: "Place page",
    description:
      "This website portfolio uses picture and srcset in order to load different picture sizes. The site is about my dream destination, Banaue Rice Terraces in the Philippines!",
    category: "RESPONSIVE",
    image_url: "/images/project-images/portfolio-1.webp",
    sourceImg: "/images/project-images/portfolio-1.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd131/place.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/place.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd131",
    views: 42,
  },
  {
    id: 2,
    title: "WDD131 home page",
    pTitle: "WDD131 home page",
    description:
      "This is a simple HTML personal homepage I've created for my course Dynamic Web Fundamentals (WDD131) in BYU-Idaho Spring Semester 2024.",
    category: "FOUNDATIONS",
    image_url: "/images/project-images/portfolio-2.webp",
    sourceImg: "/images/project-images/portfolio-2.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd131/index.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/index.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd131",
    views: 38,
  },
  {
    id: 3,
    title: "Filtered temples page",
    pTitle: "Filtered temples page",
    description:
      "This website portfolio uses filtering of array objects in JavaScript.",
    category: "JAVASCRIPT",
    image_url: "/images/project-images/portfolio-3.webp",
    sourceImg: "/images/project-images/portfolio-3.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd131/filtered-temples.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/filtered-temples.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd131",
    views: 29,
  },
  {
    id: 4,
    title: "Unfiltered temples page",
    pTitle: "Unfiltered temples page",
    description:
      "This website portfolio is the beta version of the Filtered Temples page.",
    category: "JAVASCRIPT",
    image_url: "/images/project-images/portfolio-4.webp",
    sourceImg: "/images/project-images/portfolio-4.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd131/temples.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/temples.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd131",
    views: 19,
  },
  {
    id: 5,
    title: "Holy grail layout (practice)",
    pTitle: "Holy grail layout (practice)",
    description:
      "This is only a practice website to create my first holy grail layout in HTML.",
    category: "CSS LAYOUT",
    image_url: "/images/project-images/portfolio-5.webp",
    sourceImg: "/images/project-images/portfolio-5.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd131/csspractice/holy-grail-layout-flex.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/csspractice/holy-grail-layout-flex.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd131",
    views: 25,
  },
  {
    id: 6,
    title: "Whitewater rafting site (WDD130)",
    pTitle: "Whitewater rafting site (WDD130)",
    description:
      "This website portfolio is my project in Web Fundamentals (WDD130).",
    category: "WEB DEV",
    image_url: "/images/project-images/portfolio-6.webp",
    sourceImg: "/images/project-images/portfolio-6.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd130/wwr/index.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd130/wwr/index.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd130",
    views: 31,
  },
  {
    id: 7,
    title: "Course Home Page (WDD231)",
    pTitle: "Course Home Page (WDD231)",
    description:
      "This is my course home page (WDD231).",
    category: "FRONTEND",
    image_url: "/images/project-images/portfolio-7.webp",
    sourceImg: "/images/project-images/portfolio-7.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd231/index.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd231/index.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd231",
    views: 45,
  },
  {
    id: 8,
    title: "Chamber Home Page (WDD231)",
    pTitle: "Chamber Home Page (WDD231)",
    description:
      "This is the Iloilo Chamber home page (WDD231).",
    category: "COMMUNITY",
    image_url: "/images/project-images/portfolio-8.webp",
    sourceImg: "/images/project-images/portfolio-8.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd231/chamber/index.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd231/chamber/index.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd231",
    views: 52,
  },
  {
    id: 9,
    title: "Quote Vitamins",
    pTitle: "Quote Vitamins",
    description:
      "My final project in WDD231.",
    category: "WEB APP",
    image_url: "/images/project-images/portfolio-9.webp",
    sourceImg: "/images/project-images/portfolio-9.webp",
    project_link: "https://jamesphillipdeguzman.github.io/wdd231/web-project/index.html",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd231/web-project/index.html",
    github_link: "https://github.com/jamesphillipdeguzman/wdd231",
    views: 67,
  },
  {
    id: 10,
    title: "SleepOutside (WDD330-Team Project)",
    pTitle: "SleepOutside (WDD330-Team Project)",
    description:
      "SleepOutside is an e-commerce website that sells outdoor camping gears. This is our team project in WDD330.",
    category: "E-COMMERCE",
    image_url: "/images/project-images/portfolio-10.webp",
    sourceImg: "/images/project-images/portfolio-10.webp",
    project_link: "https://sleepoutside2.netlify.app/",
    imageURL: "https://sleepoutside2.netlify.app/",
    github_link: "",
    views: 74,
  },
  {
    id: 11,
    title: "Foodexer (WDD330)",
    pTitle: "Foodexer (WDD330)",
    description:
      "This is my final project in WDD330 - Food and Exercise API",
    category: "API & APPS",
    image_url: "/images/project-images/portfolio-11.webp",
    sourceImg: "/images/project-images/portfolio-11.webp",
    project_link: "https://foodexer.netlify.app/",
    imageURL: "https://foodexer.netlify.app/",
    github_link: "",
    views: 58,
  },
  {
    id: 12,
    title: "Ralteen Fiel",
    pTitle: "Ralteen Fiel",
    description:
      "A mystery game web app about Ralteen Fiel",
    category: "GAMING",
    image_url: "/images/project-images/portfolio-12.webp",
    sourceImg: "/images/project-images/portfolio-12.webp",
    project_link: "https://ralteenfiel.netlify.app/",
    imageURL: "https://ralteenfiel.netlify.app/",
    github_link: "",
    views: 83,
  },
  {
    id: 13,
    title: "Deeday",
    pTitle: "Deeday",
    description:
      "Family Birthday Tracker App",
    category: "TOOL",
    image_url: "/images/project-images/portfolio-13.webp",
    sourceImg: "/images/project-images/portfolio-13.webp",
    project_link: "https://deeday.netlify.app/",
    imageURL: "https://deeday.netlify.app/",
    github_link: "",
    views: 41,
  },
  {
    id: 14,
    title: "Simple POS API (CSE341)",
    pTitle: "Simple POS API (CSE341)",
    description:
      "My First API project",
    category: "BACKEND API",
    image_url: "/images/project-images/portfolio-14.webp",
    sourceImg: "/images/project-images/portfolio-14.webp",
    project_link: "https://simple-pos-api.onrender.com/api-docs",
    imageURL: "https://simple-pos-api.onrender.com/api-docs",
    github_link: "",
    views: 36,
  },
  {
    id: 15,
    title: "Store POS API (CSE341-Team Project)",
    pTitle: "Store POS API (CSE341-Team Project)",
    description:
      "My Full Store API team project in CSE341",
    category: "FULLSTACK",
    image_url: "/images/project-images/portfolio-15.webp",
    sourceImg: "/images/project-images/portfolio-15.webp",
    project_link: "https://store-pos-api.onrender.com/api-docs",
    imageURL: "https://store-pos-api.onrender.com/api-docs",
    github_link: "",
    views: 49,
  },
];

/**
 * Handle get-portfolios
 * Accommodates 'views' column (default 0)
 * Gracefully falls back to DEFAULT_PORTFOLIOS if database query fails or table is empty
 */
export async function handleGetPortfolios(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

  if (!cleanUrl) {
    console.warn("No DATABASE_URL configured. Serving DEFAULT_PORTFOLIOS fallback.");
    return res.status(200).json(DEFAULT_PORTFOLIOS);
  }

  let client;
  try {
    client = new Client({ connectionString: cleanUrl });
    await client.connect();

    // Ensure views column exists if not already present in the database
    try {
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;");
    } catch {
      // Ignore if table/column already exists or user has restricted permissions
    }

    let rows = [];
    try {
      const result = await client.query(`
        SELECT id, title, description, category, image_url, project_link, github_link, COALESCE(views, 0) AS views
        FROM portfolios 
        ORDER BY id ASC;
      `);
      rows = result.rows || [];
    } catch (queryErr) {
      console.warn("Direct query failed, attempting basic query:", queryErr.message);
      const fallbackResult = await client.query(`
        SELECT id, title, description, category, image_url, project_link, github_link
        FROM portfolios 
        ORDER BY id ASC;
      `);
      rows = (fallbackResult.rows || []).map((p) => ({ ...p, views: p.views ?? 0 }));
    }

    if (!rows || rows.length === 0) {
      console.log("Portfolios table returned 0 rows, serving default portfolios.");
      return res.status(200).json(DEFAULT_PORTFOLIOS);
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Database fetch error:", err);
    // Return fallback static data so UI cards always render
    return res.status(200).json(DEFAULT_PORTFOLIOS);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {}
    }
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

  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!cleanUrl) {
    return res.status(200).json({ success: true, id, views: 1 });
  }

  let client;
  try {
    client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;");
    } catch {}

    const result = await client.query(
      `
      UPDATE portfolios
      SET views = COALESCE(views, 0) + 1
      WHERE id = $1
      RETURNING id, views;
      `,
      [id]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(200).json({ success: true, id, views: 1 });
    }

    return res.status(200).json({
      success: true,
      id: result.rows[0].id,
      views: result.rows[0].views,
    });
  } catch (err) {
    console.warn("Increment portfolio view warning:", err.message);
    return res.status(200).json({ success: true, id, views: 1 });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {}
    }
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

    const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    if (!cleanUrl) {
      return res.status(200).json({
        message: "Portfolio created (mock)",
        portfolio: { id: Date.now(), title, description, category, image_url },
      });
    }

    const client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      try {
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;");
      } catch {}

      const result = await client.query(
        `
        INSERT INTO portfolios (title, description, category, project_link, github_link, image_url, views)
        VALUES ($1, $2, $3, $4, $5, $6, 0)
        RETURNING *;
        `,
        [title, description, category, project_link || null, github || null, image_url]
      );

      return res.status(200).json({
        message: "Portfolio created successfully",
        portfolio: result.rows[0],
      });
    } finally {
      await client.end();
    }
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

    const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    if (!cleanUrl) {
      return res.status(200).json({
        message: "Portfolio updated (mock)",
        portfolio: { id, title, description, category },
      });
    }

    const client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      const result = await client.query(
        `
        UPDATE portfolios
        SET 
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          project_link = COALESCE($4, project_link),
          github_link = COALESCE($5, github_link),
          image_url = COALESCE($6, image_url)
        WHERE id = $7
        RETURNING *;
        `,
        [title, description, category, project_link || null, github_link || null, image_url || null, id]
      );

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ error: "Portfolio not found" });
      }

      return res.status(200).json({
        message: "Portfolio updated successfully",
        portfolio: result.rows[0],
      });
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error("Portfolio update error:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handle last-project
 */
export async function handleLastProject(req, res) {
  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!cleanUrl) {
    return res.status(200).json({ project: null });
  }

  let client;
  try {
    client = new Client({
      connectionString: cleanUrl,
    });

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
    console.warn("Last project query warning:", err.message);
    return res.status(200).json({ project: null });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {}
    }
  }
}
