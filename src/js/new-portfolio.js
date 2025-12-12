// new-portfolio.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("portfolio-form");
    const statusEl = document.getElementById("status");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        statusEl.textContent = "Uploading image...";

        try {
            // Get form values
            const title = form.elements["name"].value.trim();
            const description = form.elements["description"].value.trim();
            const category = form.elements["category"].value;
            const project_link = form.elements["url"].value.trim();
            const github = form.elements["github"].value.trim();
            const file = form.elements["image"].files[0];

            if (!title || !description || !file) {
                statusEl.textContent = "Title, description, and image are required.";
                return;
            }

            // Upload image to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "besytech_portfolios");

            const uploadRes = await fetch(
                "https://api.cloudinary.com/v1_1/dego6hgcb/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!uploadRes.ok) throw new Error("Image upload failed.");

            const uploadData = await uploadRes.json();
            const image_url = uploadData.secure_url;

            // Send data to Netlify function
            const res = await fetch("/.netlify/functions/createPortfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    project_link: project_link || github || null,
                    image_url,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Portfolio creation failed.");
            }

            statusEl.textContent = "Portfolio created successfully!";
            form.reset();

        } catch (err) {
            console.error(err);
            statusEl.textContent = "Error: " + err.message;
        }
    });
});
