// netlify/functions/neon-client.js
import postgres from "postgres";
import { getCleanDatabaseUrl } from "../../src/lib/db.js";

const cleanUrl = getCleanDatabaseUrl(process.env.DATABASE_URL);

export const sql = cleanUrl
  ? postgres(cleanUrl, { ssl: { rejectUnauthorized: false } })
  : null;
