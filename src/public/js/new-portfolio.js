document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("portfolio-form");
  const statusEl = document.getElementById("status");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Processing portfolio...";

    try {
      // ----- Collect form values -----
      const title = form.elements["name"].value.trim();
      const description = form.elements["description"].value.trim();
      const category = form.elements["category"].value;
      const project_link = form.elements["url"].value.trim();
      const github = form.elements["github"].value.trim();
      const file = form.elements["image"].files[0];

      if (!title || !description) {
        statusEl.textContent = "Title and description are required.";
        return;
      }

      let image_url;
      // ----- Upload image if a new file is selected -----
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "besytech_portfolios");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dego6hgcb/image/upload",
          { method: "POST", body: formData },
        );

        if (!uploadRes.ok) throw new Error("Image upload failed.");
        const uploadData = await uploadRes.json();
        image_url = uploadData.secure_url;
      }

      // ----- Prepare payload -----
      const payload = {
        title,
        description,
        category,
        project_link: project_link || github || null,
        github_link: github || null, // make sure column matches DB
      };
      if (image_url) payload.image_url = image_url;

      // ----- Determine if creating or updating -----
      const editingId = form.dataset.editingId;
      let endpoint, method;

      if (editingId && editingId !== "undefined") {
        endpoint = `/.netlify/functions/updatePortfolio?id=${editingId}`;
        method = "PUT";
      } else {
        endpoint = "/.netlify/functions/createPortfolio";
        method = "POST";
      }

      // ----- Send request -----
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Portfolio save failed.");

      // ----- Update UI -----
      statusEl.textContent = editingId
        ? "Portfolio updated successfully!"
        : "Portfolio created successfully!";

      if (!editingId) {
        form.reset();
        delete form.dataset.editingId;
      } else {
        form.dataset.editingId = String(result.portfolio.id || editingId);
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Error: " + err.message;
    }
  });
});
