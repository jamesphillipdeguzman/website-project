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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
  },
  {
    id: 16,
    title: "SANAG",
    pTitle: "SANAG",
    description: "Disaster recovery analytics platform with nightlight and assessment grids built with FastAPI, SQLite, Leaflet, and Netlify.",
    category: "FULLSTACK",
    image_url: "/images/project-images/sanag.webp",
    sourceImg: "/images/project-images/sanag.webp",
    project_link: "https://sanag.netlify.app",
    imageURL: "https://sanag.netlify.app",
    github_link: "https://github.com/jamesphillipdeguzman/sanag",
    views: 0,
  },
  {
    id: 17,
    title: "Kantimes",
    pTitle: "Kantimes",
    description: "Offline-first Progressive Web App rehearsal tool and practice timer featuring Web Audio pitch detection and audio recording.",
    category: "WEB APP",
    image_url: "/images/project-images/kantimes.webp",
    sourceImg: "/images/project-images/kantimes.webp",
    project_link: "https://kantimes.netlify.app",
    imageURL: "https://kantimes.netlify.app",
    github_link: "https://github.com/jamesphillipdeguzman/kantimes",
    views: 0,
  },
  {
    id: 18,
    title: "MedRef",
    pTitle: "MedRef",
    description: "Medical reference and lookup tool for ICD-10 diagnostic codes built with Blazor WebAssembly, .NET Core API, and MongoDB.",
    category: ".NET",
    image_url: "/images/project-images/medref.webp",
    sourceImg: "/images/project-images/medref.webp",
    project_link: "https://medref.netlify.app",
    imageURL: "https://medref.netlify.app",
    github_link: "https://github.com/jamesphillipdeguzman/medref",
    views: 0,
  },
  {
    id: 19,
    title: "DrMeet",
    pTitle: "DrMeet",
    description: "Medical clinic scheduling, appointment booking, and patient communication platform built with Node.js, Express, and MongoDB.",
    category: "FULLSTACK",
    image_url: "/images/project-images/drmeet.webp",
    sourceImg: "/images/project-images/drmeet.webp",
    project_link: "https://drmeet.netlify.app",
    imageURL: "https://drmeet.netlify.app",
    github_link: "https://github.com/jamesphillipdeguzman/drmeet",
    views: 0,
  },
  {
    id: 20,
    title: "snip8",
    pTitle: "snip8",
    description:
      "Timesheet screenshot OCR calculator and compliance monitor designed to prevent overtime breaches with strict daily cap tracking and grace window alerts.",
    category: "PRODUCTIVITY",
    image_url: "/images/project-images/snip8.webp",
    sourceImg: "/images/project-images/snip8.webp",
    project_link: "https://snip8.netlify.app",
    imageURL: "https://snip8.netlify.app",
    github_link: "https://github.com/jamesphillipdeguzman/snip8",
    views: 0,
  },
];

/**
 * Handle get-portfolios
 * Reads directly from Neon database with current views
 * Only falls back to DEFAULT_PORTFOLIOS if the database throws an unrecoverable connection error
 */
export async function handleGetPortfolios(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

  if (!cleanUrl) {
    console.error("Database connection failure: No DATABASE_URL configured. Serving DEFAULT_PORTFOLIOS fallback.");
    return res.status(200).json(DEFAULT_PORTFOLIOS);
  }

  let client;
  try {
    client = new Client({ connectionString: cleanUrl });
    await client.connect();

    // Ensure columns exist if not already present in the database
    try {
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS live_url VARCHAR(500);");
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);");
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS project_link VARCHAR(500);");
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS github_link VARCHAR(500);");
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;");
      await client.query("UPDATE portfolios SET live_url = project_link WHERE live_url IS NULL AND project_link IS NOT NULL;");
      await client.query("UPDATE portfolios SET github_url = github_link WHERE github_url IS NULL AND github_link IS NOT NULL;");
    } catch {
      // Ignore if column already exists or user has restricted permissions
    }

    const result = await client.query(`
      SELECT id, title, description, category, image_url, live_url, github_url, COALESCE(views, 0) AS views 
      FROM portfolios 
      ORDER BY id DESC;
    `);

    const rows = (result.rows || []).map((row) => ({
      ...row,
      project_link: row.project_link || row.live_url || "#",
      live_url: row.live_url || row.project_link || "#",
      github_link: row.github_link || row.github_url || "",
      github_url: row.github_url || row.github_link || "",
      views: Number(row.views) || 0,
    }));

    if (!rows || rows.length === 0) {
      console.log("Portfolios table returned 0 rows, serving default portfolios.");
      return res.status(200).json(DEFAULT_PORTFOLIOS);
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Database connection failure / fetch error:", err);
    // Return fallback static data so UI cards always render
    return res.status(200).json(DEFAULT_PORTFOLIOS);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch { }
    }
  }
}

/**
 * Atomically increment a portfolio item's view count
 */
export async function handleIncrementPortfolioView(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const id = body.id || req.query?.id;

  if (!id) {
    return res.status(400).json({ error: "Missing portfolio id" });
  }

  const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!cleanUrl) {
    console.error("Database connection failure: No DATABASE_URL configured for view increment.");
    return res.status(200).json({ success: true, views: 1 });
  }

  let client;
  try {
    client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;");
    } catch { }

    const numericId = Number(id);
    const targetId = isNaN(numericId) ? id : numericId;

    const { rows } = await client.query(
      `UPDATE portfolios 
       SET views = COALESCE(views, 0) + 1 
       WHERE id = $1 
       RETURNING views;`,
      [targetId]
    );

    const views = rows && rows.length > 0 ? Number(rows[0].views) : 1;
    return res.status(200).json({
      success: true,
      views: views,
    });
  } catch (err) {
    console.error("Increment portfolio view error:", err);
    return res.status(200).json({ success: true, views: 1 });
  } finally {
    if (client) {
      try {
        await client.end();
      } catch { }
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
    const liveUrl = (body.project_link || body.live_url || "#").trim();
    const githubUrl = (body.github_link || body.github_url || "#").trim();
    const imageUrl = (body.image_url || body.sourceImg || "/images/project-images/no-image-placeholder.webp").trim();
    const title = body.title?.trim();
    const description = body.description?.trim() || "";
    const category = body.category?.trim() || "OTHER";

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    if (!cleanUrl) {
      return res.status(200).json({
        message: "Portfolio created (mock)",
        portfolio: {
          id: Date.now(),
          title,
          description,
          category,
          image_url: imageUrl,
          live_url: liveUrl,
          project_link: liveUrl,
          github_url: githubUrl,
          github_link: githubUrl,
        },
      });
    }

    const client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS portfolios (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          category VARCHAR(100),
          live_url VARCHAR(500),
          project_link VARCHAR(500),
          github_url VARCHAR(500),
          github_link VARCHAR(500),
          image_url VARCHAR(500),
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      try {
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS live_url VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS project_link VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS github_link VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;");
      } catch { }

      const result = await client.query(
        `
        INSERT INTO portfolios (title, description, category, live_url, project_link, github_url, github_link, image_url)
        VALUES ($1, $2, $3, $4, $4, $5, $5, $6)
        RETURNING *;
        `,
        [title, description, category, liveUrl, githubUrl, imageUrl]
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
 * Handle updatePortfolio / savePortfolio
 */
export async function handleUpdatePortfolio(req, res) {
  try {
    if (req.method !== "PUT" && req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const id = req.query?.id || body.id;

    if (!id) {
      return res.status(400).json({
        error: "Portfolio ID is required",
      });
    }

    const liveUrl = (body.project_link || body.live_url || "#").trim();
    const githubUrl = (body.github_link || body.github_url || "#").trim();
    const imageUrl = (body.image_url || body.sourceImg || "/images/project-images/no-image-placeholder.webp").trim();
    const title = body.title?.trim();
    const description = body.description?.trim() || "";
    const category = body.category?.trim() || "OTHER";

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    if (!cleanUrl) {
      return res.status(200).json({
        message: "Portfolio updated (mock)",
        portfolio: {
          id,
          title,
          description,
          category,
          live_url: liveUrl,
          project_link: liveUrl,
          github_url: githubUrl,
          github_link: githubUrl,
          image_url: imageUrl,
        },
      });
    }

    const client = new Client({ connectionString: cleanUrl });
    await client.connect();

    try {
      try {
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS live_url VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS project_link VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS github_link VARCHAR(500);");
        await client.query("ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);");
      } catch { }

      const result = await client.query(
        `
        UPDATE portfolios 
        SET title = $1, 
            description = $2, 
            category = $3, 
            live_url = $4, 
            project_link = $4, 
            github_url = $5, 
            github_link = $5, 
            image_url = $6
        WHERE id = $7
        RETURNING *;
        `,
        [title, description, category, liveUrl, githubUrl, imageUrl, id]
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

export const handleSavePortfolio = handleUpdatePortfolio;

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
      } catch { }
    }
  }
}
