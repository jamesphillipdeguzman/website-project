import { Client } from "@neondatabase/serverless";

// Use the environment variable directly
const client = new Client({
  connectionString: process.env.NEON_DB_URL, // Netlify injects this
  ssl: { rejectUnauthorized: false }, // optional, depending on Neon
});

await client.connect();
