(function(){
  const SHEET_ID = window.SHEET_ID;
  const GID = window.GID;
  const PAGE_NAME = window.PAGE_NAME;
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;

  const grid = document.getElementById('grid');

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text.toString();
    return div.innerHTML;
  }

  function createCard(item) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="img">
        ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" onerror="this.style.display='none';">` : 'Geen afbeelding'}
      </div>
      <div class="nr">Nr. ${escapeHtml(item.nr)}</div>
      <div class="title">${escapeHtml(item.title)}</div>
      <div class="muted">${item.bijzonderheden || ''}</div>
      <div class="pill">${item.conditie || 'Onbekend'}</div>
      ${item.prijs ? `<div class="price">€ ${escapeHtml(item.prijs)}</div>` : ''}
    `;
    return el;
  }

  fetch(URL)
    .then(r => r.text())
    .then(txt => {
      const json = JSON.parse(txt.substring(47).slice(0, -2));
      const cols = json.table.cols.map(c => c.label || '');
      const rows = json.table.rows || [];

      const I = {
        nr: cols.indexOf('nr'),
        title: cols.indexOf('title'),
        image: cols.indexOf('image'),
        conditie: cols.indexOf('conditie'),
        bijzonderheden: cols.indexOf('bijzonderheden'),
        prijs: cols.indexOf('prijs')
      };

      rows.forEach(r => {
        const c = r.c || [];
        const item = {
          nr: c[I.nr]?.v || '',
          title: c[I.title]?.v || '',
          image: c[I.image]?.v || '',
          conditie: c[I.conditie]?.v || '',
          bijzonderheden: c[I.bijzonderheden]?.v || '',
          prijs: c[I.prijs]?.v || ''
        };
        grid.appendChild(createCard(item));
      });
    })
    .catch(err => {
      grid.innerHTML = `<div class="card"><div class="title">Kon gegevens niet ophalen</div><div class="muted">${escapeHtml(err.message)}</div></div>`;
    });
})();
