import { Client } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

/* ------------------------------
   Register Function
------------------------------ */

export async function handler(event) {
  console.log("Request body:", event.body);
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, email, password, user_type } = JSON.parse(event.body);
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

    return { statusCode: 200, body: JSON.stringify({ message: "User registered successfully" }) };
  } catch (error) {
    console.error("Register error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  } finally {
    await client.end();
  }
}
