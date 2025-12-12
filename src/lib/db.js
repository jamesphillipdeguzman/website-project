// lib/db.js
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false }, // required for Neon
});

export { sql };
