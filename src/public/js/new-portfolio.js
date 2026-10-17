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
    const title = form.elements["name"] ? form.elements["name"].value.trim() : "";
    const description = form.elements["description"] ? form.elements["description"].value.trim() : "";
    const category = form.elements["category"] ? form.elements["category"].value : "PROJECT";

    const projectLinkInput =
      document.getElementById("project_link") ||
      document.getElementById("live_url") ||
      document.getElementById("url") ||
      form.elements["project_link"] ||
      form.elements["live_url"] ||
      form.elements["url"] ||
      document.querySelector('input[name="project_link"]') ||
      document.querySelector('input[name="live_url"]');

    const projectLinkVal = projectLinkInput ? projectLinkInput.value.trim() : "";

    const githubInput =
      document.getElementById("github_link") ||
      document.getElementById("github_url") ||
      document.getElementById("github") ||
      form.elements["github_link"] ||
      form.elements["github_url"] ||
      form.elements["github"] ||
      document.querySelector('input[name="github_link"]') ||
      document.querySelector('input[name="github_url"]');

    const githubLinkVal = githubInput ? githubInput.value.trim() : "";

    if (!title || !description)
      throw new Error("Title and description are required.");

    let image_url = form.dataset.existingImage || "/images/project-images/no-image-placeholder.webp";
    const file = fileInput?.files?.[0];
    if (file) {
      try {
        image_url = await uploadImage(file);
      } catch (uploadErr) {
        console.warn("Cloudinary upload failed, falling back:", uploadErr);
      }
    }

    return {
      title,
      description,
      category: category || "PROJECT",
      project_link: projectLinkVal || "#",
      live_url: projectLinkVal || "#",
      github_link: githubLinkVal || "#",
      github_url: githubLinkVal || "#",
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
      ? `/api/updatePortfolio?id=${editingId}`
      : "/api/createPortfolio";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Portfolio save failed.");

    if (isEdit && result.portfolio)
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
    if (statusEl) statusEl.textContent = "Processing portfolio...";
    if (statusEl2) statusEl2.textContent = "Processing portfolio...";

    try {
      const payload = await getFormPayload();
      const isEdit = await savePortfolio(payload);

      const msg = isEdit
        ? "✅ Portfolio updated successfully! Redirecting..."
        : "✅ Portfolio created successfully! Redirecting...";

      if (statusEl) statusEl.textContent = msg;
      if (statusEl2) statusEl2.textContent = msg;

      setTimeout(() => {
        window.location.href = "/pages/portfolios.html";
      }, 1200);
    } catch (err) {
      console.error("Portfolio save error:", err);
      if (statusEl) statusEl.textContent = "❌ " + err.message;
      if (statusEl2) statusEl2.textContent = "❌ " + err.message;
      // Do not wipe inputs on error so user doesn't lose typed data
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
