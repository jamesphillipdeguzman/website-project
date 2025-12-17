document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("portfolio-form");
  const statusEl = document.getElementById("status");

  if (!form) return;

  /**
   * Uploads an image to Cloudinary and returns the secure URL
   * @param {File} file
   * @returns {Promise<string>}
   */
  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "besytech_portfolios");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dego6hgcb/image/upload",
      { method: "POST", body: formData },
    );

    if (!res.ok) throw new Error("Image upload failed.");
    const data = await res.json();
    return data.secure_url;
  }

  /**
   * Collects form values into a payload
   * @returns {Promise<Object>}
   */
  async function getFormPayload() {
    const title = form.elements["name"].value.trim();
    const description = form.elements["description"].value.trim();
    const category = form.elements["category"].value;
    const project_link = form.elements["url"].value.trim();
    const github_link = form.elements["github"].value.trim();
    const file = form.elements["image"].files[0];

    if (!title || !description) {
      throw new Error("Title and description are required.");
    }

    // Use existing image by default
    let image_url = form.dataset.existingImage || null;

    // Upload new image if selected
    if (file) {
      image_url = await uploadImage(file);
    }

    return {
      title,
      description,
      category,
      project_link: project_link || github_link || null,
      github_link: github_link || null,
      image_url,
    };
  }

  /**
   * Sends the payload to the appropriate endpoint
   * @param {Object} payload
   */
  async function savePortfolio(payload) {
    const editingId = form.dataset.editingId;
    const isEdit = Boolean(editingId && editingId !== "undefined");

    const endpoint = isEdit
      ? `/.netlify/functions/updatePortfolio?id=${editingId}`
      : "/.netlify/functions/createPortfolio";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Portfolio save failed.");

    // Update form dataset if editing
    if (isEdit)
      form.dataset.editingId = String(result.portfolio.id || editingId);

    return isEdit;
  }

  /**
   * Resets the form and image preview
   */
  function resetForm() {
    form.reset();
    delete form.dataset.editingId;
    form.dataset.existingImage = "";

    const preview = document.getElementById("image-preview");
    if (preview) {
      preview.src = "";
      preview.style.display = "none";
    }

    if (statusEl) statusEl.textContent = "➕ Creating a new portfolio";
  }

  // --- Handle form submission ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!statusEl) return;

    statusEl.textContent = "Processing portfolio...";

    try {
      const payload = await getFormPayload();
      const isEdit = await savePortfolio(payload);

      statusEl.textContent = isEdit
        ? "✅ Portfolio updated successfully!"
        : "✅ Portfolio created successfully!";

      if (!isEdit) resetForm();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "❌ " + err.message;
    }
  });

  /**
   * Update image preview on file selection
   */
  const fileInput = form.querySelector('[name="image"]');
  const preview = document.getElementById("image-preview");

  if (fileInput && preview) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      } else if (form.dataset.existingImage) {
        // fallback to existing image
        preview.src = form.dataset.existingImage;
        preview.style.display = "block";
      } else {
        preview.src = "";
        preview.style.display = "none";
      }
    });
  }
});
