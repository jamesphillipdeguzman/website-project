document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("clients-body");
  if (!tbody) return;

  let clientsData = [];

  try {
    const res = await fetch("/.netlify/functions/get-clients");
    const clients = await res.json();

    if (!clients || clients.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No clients found.</td></tr>`;
      return;
    }

    clientsData = clients.map((client, index) => {
      const createdAt = new Date(client.created_at).toLocaleString();
      const lastLogin = client.last_login
        ? new Date(client.last_login).toLocaleString()
        : "-";

      return {
        "#": index + 1,
        Name: client.name || "-",
        Email: client.email || "-",
        "Created At": createdAt,
        "Last Login": lastLogin,
      };
    });

    tbody.innerHTML = clientsData
      .map(
        (c) => `<tr>
          <td>${c["#"]}</td>
          <td>${c.Name}</td>
          <td>${c.Email}</td>
          <td>${c["Created At"]}</td>
          <td>${c["Last Login"]}</td>
        </tr>`,
      )
      .join("");
  } catch (err) {
    console.error("Failed to load clients:", err);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error loading clients</td></tr>`;
  }

  // CSV download
  const downloadCSV = (filename, data) => {
    const csvRows = [];
    // Headers
    csvRows.push(Object.keys(data[0]).join(","));
    // Rows
    data.forEach((row) => {
      csvRows.push(
        Object.values(row)
          .map((v) => `"${v}"`)
          .join(","),
      );
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  document.getElementById("export-csv2")?.addEventListener("click", () => {
    if (!clientsData.length) return alert("No client data to export");
    downloadCSV("clients_export.csv", clientsData);
  });
});
