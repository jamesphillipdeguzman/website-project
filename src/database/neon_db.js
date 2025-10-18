import { Client } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
  // Use the environment variable directly
  const client = new Client({
    connectionString: process.env.NEON_DB_URL, // Netlify injects this
    ssl: { rejectUnauthorized: false }, // optional, depending on Neon
  });

  try {
    await client.connect();
    console.log("✅ Connected successfully to Neon database!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await client.connect();
  }
}

testConnection();
