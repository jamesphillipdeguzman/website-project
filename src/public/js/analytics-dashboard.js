document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("analytics-body");
  const eventsCount = document.getElementById("events-count");
  if (!tbody) return;

  try {
    const data = await (
      await fetch("/.netlify/functions/get-analytics")
    ).json();
    console.log(data);

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No analytics data yet.</td></tr>`;
      eventsCount.textContent = 0;
      return;
    }

    // Update total events count
    eventsCount.textContent = data.length;

    tbody.innerHTML = data
      .map((row, index) => {
        const date = new Date(row.created_at).toLocaleString();
        const type = row.visitor_type || "Guest";
        const name = row.name || row.email || "Guest";
        const badgeClass = type.toLowerCase();

        let deviceType = "Unknown";
        const ua = row.device || row.user_agent || "";
        if (/mobile/i.test(ua)) {
          if (/iphone/i.test(ua)) deviceType = "Mobile/iPhone";
          else if (/android/i.test(ua)) deviceType = "Mobile/Android";
          else deviceType = "Mobile";
        } else if (/ipad|tablet/i.test(ua)) deviceType = "Tablet";
        else deviceType = "Desktop";

        return `
      <tr>
        <td data-label="#">${index + 1}</td>
        <td data-label="Date">${date}</td>
        <td data-label="Name">${name}</td>
        <td data-label="Type"><span class="badge ${badgeClass}">${type}</span></td>
        <td data-label="Page">${row.page_url || "-"}</td>
        <td data-label="Event">${row.event_type || "-"}</td>
        <td data-label="Referrer">${row.referrer_url || "Direct"}</td>
        <td data-label="Device">${deviceType}</td>
      </tr>
    `;
      })
      .join("");
  } catch (err) {
    console.error("Failed to load analytics:", err);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error loading analytics</td></tr>`;
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
