import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../../lib/db.js"; // your Neon helper
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
    }

    const form = new formidable.IncomingForm({ multiples: false });

    return new Promise((resolve) => {
        form.parse(event, async (err, fields, files) => {
            if (err) {
                console.error(err);
                resolve({ statusCode: 500, body: JSON.stringify({ error: "Form parse failed" }) });
                return;
            }

            try {
                const { title, description, category, url, github } = fields;

                if (!title || !description || !files.image) {
                    resolve({ statusCode: 400, body: JSON.stringify({ error: "Title, description, and image are required" }) });
                    return;
                }

                // Upload to Cloudinary
                const uploadedImage = await cloudinary.uploader.upload(files.image.filepath, {
                    folder: "besystech_portfolios",
                    resource_type: "image",
                });

                const image_url = uploadedImage.secure_url;

                // Insert into Neon
                const result = await sql`
                    INSERT INTO portfolios (title, description, category, project_link, image_url)
                    VALUES (${title}, ${description}, ${category}, ${url || github || null}, ${image_url})
                    RETURNING *;
                `;

                resolve({ statusCode: 200, body: JSON.stringify({ message: "Portfolio created", portfolio: result[0] }) });
            } catch (error) {
                console.error("Portfolio creation error:", error);
                resolve({ statusCode: 500, body: JSON.stringify({ error: error.message }) });
            }
        });
    });
}
