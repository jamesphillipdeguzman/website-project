// lib/db.js
import postgres from "postgres";

/**
 * Strips channel_binding=require and any channel_binding parameter from database URLs
 * to ensure clean, reliable connections to Neon via the connection pooler.
 */
export function getCleanDatabaseUrl(rawUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  return rawUrl
    .replace(/[?&]channel_binding=[^&]+/g, (match) => (match.startsWith("?") ? "?" : ""))
    .replace(/\?&/, "?")
    .replace(/\?$/, "");
}

// Ensure process.env.DATABASE_URL is sanitized in place for any consumer
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = getCleanDatabaseUrl(process.env.DATABASE_URL);
}
if (process.env.NETLIFY_DATABASE_URL) {
  process.env.NETLIFY_DATABASE_URL = getCleanDatabaseUrl(process.env.NETLIFY_DATABASE_URL);
}

const cleanDatabaseUrl = getCleanDatabaseUrl();

let sql = null;
try {
  if (cleanDatabaseUrl) {
    sql = postgres(cleanDatabaseUrl, {
      ssl: { rejectUnauthorized: false }, // required for Neon
    });
  }
} catch (err) {
  console.warn("Postgres client initialization warning:", err.message);
  sql = null;
}

export { sql };
