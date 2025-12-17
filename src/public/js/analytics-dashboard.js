// js/analytics-dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("analytics-body");
  if (!tbody) return;

  try {
    const res = await fetch("/.netlify/functions/analytics");
    const data = await res.json();

    if (!data.rows || data.rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No analytics data yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.rows
      .map((row, index) => {
        const date = new Date(row.created_at).toLocaleString();
        const type = row.visitor_type || "Guest";
        const badgeClass = type.toLowerCase(); // guest, admin, client

        return `
          <tr style="background-color: ${index % 2 === 0 ? "#e0f7ff" : "#ffe7d6"};">
            <td>${date}</td>
            <td>${row.visitor_name}</td>
            <td><span class="badge ${badgeClass}">${type}</span></td>
            <td>${row.page || "-"}</td>
            <td>${row.event_type || "-"}</td>
            <td>${row.referrer || "Direct"}</td>
            <td>${row.device || "Unknown"}</td>
          </tr>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Failed to load analytics:", err);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error loading analytics</td></tr>`;
  }
});
