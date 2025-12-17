document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("portfolio-form");
  const statusEl = document.getElementById("status");
  const statusEl2 = document.getElementById("status2");

  if (!form) return;

  const preview = document.getElementById("image-preview");
  const fileInput = form.querySelector('[name="image"]');

  /**
   * Upload image to Cloudinary
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
   * Collect form values into payload
   */
  async function getFormPayload() {
    const title = form.elements["name"].value.trim();
    const description = form.elements["description"].value.trim();
    const category = form.elements["category"].value;
    const project_link = form.elements["url"].value.trim();
    const github_link = form.elements["github"].value.trim();
    const file = fileInput.files[0];

    if (!title || !description)
      throw new Error("Title and description are required.");

    let image_url = form.dataset.existingImage || null;
    if (file) image_url = await uploadImage(file);

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
   * Send payload to server
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

    if (isEdit)
      form.dataset.editingId = String(result.portfolio.id || editingId);

    return isEdit;
  }

  /**
   * Reset form + placeholder image
   */
  function resetForm() {
    form.reset();
    delete form.dataset.editingId;
    form.dataset.existingImage = "";

    if (preview) {
      preview.src = "/images/project-images/no-image-placeholder.webp";
      preview.alt = "No Image";
      preview.style.display = "block";
    }

    if (fileInput) fileInput.value = "";

    if (statusEl) statusEl.textContent = "➕ Creating a new portfolio";
    if (statusEl2) statusEl2.textContent = "➕ Creating a new portfolio";
  }

  // --- Form submit handler ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!statusEl) return;

    statusEl.textContent = "Processing portfolio...";
    if (!statusEl2) return;

    statusEl2.textContent = "Processing portfolio...";

    try {
      const payload = await getFormPayload();
      const isEdit = await savePortfolio(payload);

      statusEl.textContent = isEdit
        ? "✅ Portfolio updated successfully!"
        : "✅ Portfolio created successfully!";

      statusEl2.textContent = isEdit
        ? "✅ Portfolio updated successfully!"
        : "✅ Portfolio created successfully!";

      if (!isEdit) resetForm();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "❌ " + err.message;
      statusEl2.textContent = "❌ " + err.message;
    }
  });

  // --- Top save button triggers form submit ---
  const topBtn = document.getElementById("top-save-portfolio-btn");
  if (topBtn) {
    topBtn.addEventListener("click", () => form.requestSubmit());
  }

  // --- Image preview logic ---
  if (fileInput && preview) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      } else if (form.dataset.existingImage) {
        preview.src = form.dataset.existingImage;
        preview.style.display = "block";
      } else {
        preview.src = "/images/project-images/no-image-placeholder.webp";
        preview.style.display = "block";
      }
    });
  }
});
