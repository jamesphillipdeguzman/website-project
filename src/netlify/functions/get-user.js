import { Client } from "@neondatabase/serverless";

export default async (req, res) => {
  const userId = req.query?.id || 1;

  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const result = await client.query("SELECT name FROM users WHERE id = $1", [
      userId,
    ]);
    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ name: null, message: "User not found" });
    }

    return res.status(200).json({ name: result.rows[0].name });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return res
      .status(500)
      .json({ name: null, message: "Internal Server Error" });
  }
};
