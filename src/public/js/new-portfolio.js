const form = document.getElementById("portfolio-form");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Saving...";

    const formData = new FormData(form);

    try {
        const response = await fetch("/.netlify/functions/createPortfolio", {
            method: "POST",
            body: formData, // multipart/form-data for file upload
        });

        const result = await response.json();

        if (!response.ok) throw result;

        statusEl.textContent = "✅ Portfolio added!";
        form.reset();
    } catch (err) {
        console.error(err);
        statusEl.textContent = "❌ Failed to save portfolio.";
    }
});
