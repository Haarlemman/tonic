<!-- Include PapaParse -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const url = window.CSV_URL; // set this per page in HTML
  const pageFilter = window.PAGE_NAME?.toLowerCase().trim() || '';

  fetch(url)
    .then(res => res.text())
    .then(csvText => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const rows = results.data;
          const grid = document.getElementById('grid');
          grid.innerHTML = '';

          let count = 0;
          rows.forEach(item => {
            if (!pageFilter || (item.Serie || '').toLowerCase().includes(pageFilter)) {
              const card = document.createElement('div');
              card.className = 'card';
              card.innerHTML = `
                <div class="img" onclick="openPop('${item.cover}','${item.Title}')">
                  <img src="${item.cover}" alt="${item.Title}" onerror="this.nextElementSibling.style.display='block'; this.style.display='none'">
                  <div class="no-img-text" style="display:none">Geen afbeelding beschikbaar</div>
                </div>
                <div class="title">${item.Title}</div>
                <div class="muted">${item.Year || ''} ${item.Edition || ''}</div>
                <div class="price">${item.prijs ? '€ ' + item.prijs : ''}</div>
                <div><a class="link" href="${item['LastDodo Link']}" target="_blank">Bekijk op LastDodo</a></div>
              `;
              grid.appendChild(card);
              count++;
            }
          });

          if (count === 0) {
            grid.innerHTML = `<div class="card"><div class="title">Geen items gevonden</div></div>`;
          }
        },
        error: err => {
          console.error(err);
          document.getElementById('grid').innerHTML = `<div class="card"><div class="title">Fout bij laden</div></div>`;
        }
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById('grid').innerHTML = `<div class="card"><div class="title">Fout bij laden</div></div>`;
    });
});
</script>
