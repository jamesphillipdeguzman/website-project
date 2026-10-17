document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("analytics-body");
  const eventsCount = document.getElementById("events-count");
  if (!tbody) return;

  try {
    let res = await fetch("/api/analytics");
    if (!res.ok) {
      res = await fetch("/api/get-analytics");
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No analytics data yet.</td></tr>`;
      eventsCount.textContent = 0;
    } else {
      eventsCount.textContent = data.length;

      tbody.innerHTML = data
        .map((row, index) => {
          const rawDate = row.date || row.created_at;
          const date = rawDate ? new Date(rawDate).toLocaleString() : "-";
          const type = row.type || row.visitor_type || "navigation";
          const name = row.name || "Anonymous";
          const badgeClass = String(type).toLowerCase();
          const page = row.page || row.page_url || "-";
          const event = row.event || row.event_type || "-";
          const referrer = row.referrer || row.referrer_url || "Direct";
          const device = row.device || "Desktop";

          return `
        <tr>
          <td data-label="#">${index + 1}</td>
          <td data-label="Date">${date}</td>
          <td data-label="Name">${name}</td>
          <td data-label="Type"><span class="badge ${badgeClass}">${type}</span></td>
          <td data-label="Page">${page}</td>
          <td data-label="Event">${event}</td>
          <td data-label="Referrer">${referrer}</td>
          <td data-label="Device">${device}</td>
        </tr>
      `;
        })
        .join("");
    }
  } catch (err) {
    console.error("Failed to load analytics:", err);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:red;">Error loading analytics</td></tr>`;
  }

  // Clear Analytics handler
  const clearBtn = document.getElementById("clearAnalyticsBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to clear all analytics events?")) return;

      try {
        const res = await fetch("/api/analytics", {
          method: "DELETE",
        });

        if (res.ok) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No analytics data yet.</td></tr>`;
          if (eventsCount) eventsCount.textContent = 0;
          const visitCountEl = document.getElementById("visit-count");
          if (visitCountEl) visitCountEl.textContent = 0;
          alert("Analytics cleared successfully.");
        } else {
          alert("Failed to clear analytics.");
        }
      } catch (err) {
        console.error("Error clearing analytics:", err);
        alert("Error clearing analytics events.");
      }
    });
  }

  function downloadCSV(filename, rows) {
    const csvContent = rows
      .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    link.click();
  }

  document.getElementById("export-csv")?.addEventListener("click", () => {
    const table = document.querySelector(".analytics-table");
    if (!table) return;

    const rows = [];
    // Get header row
    const headers = Array.from(table.querySelectorAll("thead th")).map(
      (th) => th.innerText,
    );
    rows.push(headers);

    // Get body rows
    table.querySelectorAll("tbody tr").forEach((tr) => {
      const cells = Array.from(tr.querySelectorAll("td")).map(
        (td) => td.innerText,
      );
      rows.push(cells);
    });

    downloadCSV("analytics_export.csv", rows);
  });
});
