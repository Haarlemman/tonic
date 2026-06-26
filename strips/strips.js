async function loadComics() {
  const sheetId = "1z_SeCSAdMrFYq_xkN2-WwL-6HJ7LxFqONh_yrMfhsOU"; 
  const gid = "0"; 
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows;
    const itemsContainer = document.getElementById("items");

    // get series name from page, or show all
    const filterSerie = window.PAGE_SERIES || null;

    let found = false;

    rows.forEach(row => {
      const values = row.c.map(cell => cell ? cell.v : "");

      const cover = values[0];
      const title = values[1];
      const serie = values[2];
      const year = values[3];
      const edition = values[4];
      const link = values[5];
      const prijs = values[6];

      // filter if PAGE_SERIES set
      if (filterSerie && serie !== filterSerie) return;

      const card = document.createElement("div");
      card.className = "item-card";

      card.innerHTML = `
        <img src="${cover}" alt="${title}" class="cover">
        <h3>${title}</h3>
        <p><strong>Serie:</strong> ${serie}</p>
        <p><strong>Jaar:</strong> ${year}</p>
        <p><strong>Uitgave:</strong> ${edition}</p>
        <p><strong>Prijs:</strong> €${prijs}</p>
        <a href="${link}" target="_blank">Bekijk op LastDodo</a>
      `;

      itemsContainer.appendChild(card);
      found = true;
    });

    if (!found) {
      itemsContainer.innerHTML = "<p>Geen items gevonden</p>";
    }

  } catch (err) {
    console.error("Error loading data", err);
  }
}

document.addEventListener("DOMContentLoaded", loadComics);
