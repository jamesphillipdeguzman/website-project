import { Client } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

/* ------------------------------
   Register Function
------------------------------ */

export default async function handler(req, res) {
  console.log("Request body:", req.body);
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const { name, email, password, user_type } = body;
  console.log({ name, email, password, user_type });

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log("Connected to database ✅");

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed ✅");

    await client.query(
      `INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4)`,
      [name, email, hashedPassword, user_type ?? "Client"]
    );

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}
