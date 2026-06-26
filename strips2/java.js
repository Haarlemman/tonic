(function() {
  const SHEET_ID = window.SHEET_ID;
  const GID = window.GID;
  const PAGE_NAME = window.PAGE_NAME || 'Strips';
  const PAGE_COLUMNS = window.PAGE_COLUMNS;

  const grid = document.getElementById('grid');
  const buyBtn = document.getElementById('buyBtn');
  const badge = document.getElementById('badge');
  const popup = document.getElementById('popup');
  const popimg = document.getElementById('popimg');

  const all = [];
  const selected = new Set();

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function findIndex(cols, names) {
    names = names.map(n => n.toLowerCase());
    for (let i = 0; i < cols.length; i++) {
      const label = (cols[i] || '').toLowerCase().trim();
      if (!label) continue;
      if (names.includes(label)) return i;
      for (const n of names) if (label.indexOf(n) !== -1) return i;
    }
    return -1;
  }

  function createCard(item, index) {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.index = index;

    const imgSrc = item.image || '';
    const imgAlt = item.title || 'Strip afbeelding';

    const imgBlock = imgSrc ? `<div class="img" onclick="openPop('${escapeHtml(imgSrc)}','${escapeHtml(imgAlt)}')">
        <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(imgAlt)}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <div style="display:none;padding:10px;color:#666;text-align:center;font-size:12px;border:1px dashed #ddd;">Geen afbeelding beschikbaar</div>
      </div>` : `<div class="img"><div style="padding:10px;color:#666;text-align:center;">Geen afbeelding</div></div>`;

    el.innerHTML = `
      <div class="select-checkbox"><input type="checkbox" data-i="${index}" onchange="toggleSel(${index}, this.checked)"></div>
      ${imgBlock}
      <div class="nr">Nr. ${escapeHtml(item.nr)}</div>
      <div class="title">${escapeHtml(item.title)}</div>
      <div class="muted">${item.druk ? `<strong>Druk:</strong> ${escapeHtml(item.druk)}<br>` : ''}${item.bijzonderheden ? `<strong>Bijzonderheden:</strong> ${escapeHtml(item.bijzonderheden)}<br>` : ''}</div>
      <div class="pill">${escapeHtml(item.conditie || 'Onbekend')}</div>
      ${item.prijs ? `<div class="price">€${escapeHtml(item.prijs)}</div>` : ''}
      ${item.link ? `<div><a class="link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener">Bekijk op externe link</a></div>` : ''}
    `;
    return el;
  }

  window.openPop = function(src, alt) {
    if(!src) return;
    popimg.src = src;
    popimg.alt = alt || '';
    popup.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  window.closePop = function() {
    popup.classList.remove('show');
    document.body.style.overflow = 'auto';
  };
  window.toggleSel = function(i,on){
    if(on) selected.add(i); else selected.delete(i);
    const n = selected.size;
    buyBtn.disabled = n === 0;
    badge.style.display = n ? 'flex' : 'none';
    badge.textContent = n;
  };

  grid.innerHTML = `<div class="card"><div class="title">Laden...</div><div class="muted">Bezig met ophalen van gegevens...</div></div>`;

  fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`)
    .then(r => r.text())
    .then(txt => {
      const json = JSON.parse(txt.substring(47).slice(0,-2));
      const cols = json.table.cols.map(c=>c.label||'');
      const rows = json.table.rows;

      // map column indexes
      const I = {};
      for(const key in PAGE_COLUMNS){
        I[key] = findIndex(cols, PAGE_COLUMNS[key]);
      }

      grid.innerHTML = '';
      rows.forEach((r,idx)=>{
        const c = r.c||[];
        const item = {};
        for(const key in I){
          item[key] = I[key] >=0 && c[I[key]] ? c[I[key]].v : '';
        }
        all.push(item);
        grid.appendChild(createCard(item, all.length-1));
      });
    }).catch(err=>{
      grid.innerHTML = `<div class="card"><div class="title">Fout bij laden</div><div class="muted">${escapeHtml(err.message)}</div></div>`;
    });

})();
