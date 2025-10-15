const client = new Client({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});
