(function(){
  const SHEET_ID = window.SHEET_ID;
  const GID = window.GID;
  const PAGE_NAME = window.PAGE_NAME.toLowerCase().trim();
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
  const grid = document.getElementById('grid');

  grid.innerHTML = '<div class="card"><div class="title">Laden...</div></div>';

  fetch(URL)
    .then(r => r.text())
    .then(txt => {
      console.log('Raw sheet data:', txt.substring(0, 200)); // just first 200 chars
      const json = JSON.parse(txt.substring(47).slice(0,-2));
      console.log('Parsed JSON:', json);
      grid.innerHTML = `<div class="card"><div class="title">Data loaded: ${json.table.rows.length} rows</div></div>`;
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = '<div class="card"><div class="title">Fetch failed</div></div>';
    });
})();
