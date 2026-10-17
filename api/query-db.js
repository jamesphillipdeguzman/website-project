import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

/* ------------------------------
   Vercel Serverless Function
------------------------------ */
export default async function handler(req, res) {
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
      console.error(
        "❌ No database URL found. Env keys available:",
        Object.keys(process.env).filter((k) => k.toLowerCase().includes("db")),
      );
      return res.status(500).json({
        error: "No database connection string found in environment variables.",
      });
    }

    const client = new Client({ connectionString });
    await client.connect();

    console.log(
      "✅ Connected to Neon via:",
      connectionString.includes("neon.tech") ? "Neon" : "Other",
    );
    console.log("🧠 Running query:", query);

    const result = await client.query(query);
    await client.end();

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error occurred:", error);
    return res.status(500).json({ error: error.message });
  }
}

/* ------------------------------
   CLI Mode (Run via Node)
------------------------------ */
if (process.argv[1] && path.basename(process.argv[1]).startsWith("query-db")) {
  const run = async () => {
    const query = process.argv[2];
    const connectionString =
      process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

    if (!query) {
      console.log("⚠️  Please provide an SQL query.");
      console.log(
        '👉 Example: node api/query-db.js "SELECT NOW();"',
      );
      return;
    }

    if (!connectionString) {
      console.error("❌ No DB URL defined.");
      return;
    }

    const client = new Client({ connectionString });
    await client.connect();

    try {
      console.log("✅ Connected to Neon");
      const result = await client.query(query);
      console.table(result.rows);
      console.log(`✅ Query complete. Rows returned: ${result.rowCount}`);
    } catch (error) {
      console.error("❌ Query failed:", error.message);
    } finally {
      await client.end();
    }
  };

  run();
}
