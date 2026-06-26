(function(){
  const SHEET_ID = window.SHEET_ID;
  const GID = window.GID;
  const PAGE_NAME = window.PAGE_NAME.toLowerCase().trim();

  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
  const grid = document.getElementById('grid');
  const buyBtn = document.getElementById('buyBtn');
  const badge = document.getElementById('badge');
  const popup = document.getElementById('popup');
  const popimg = document.getElementById('popimg');

  const selected = new Set();
  const all = [];

  function escapeHtml(text){ 
    return text ? text.toString().replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])) : ''; 
  }

  function genImg(nr,title){
    if(!nr||!title) return '';
    const short = title.toLowerCase().replace(/^(de |het |een |der )/i,'').replace(/[^a-z0-9]/g,'').substring(0,10);
    return `https://davidenker.com/strips/images/${nr}${short}.jpg`;
  }

  function createCard(item,index){
    const el = document.createElement('div'); 
    el.className='card'; 
    el.dataset.index=index;

    const conditie = (item.conditie||'').toLowerCase();
    let pillClass='pill';
    if(conditie.includes('goed')||conditie.includes('uitstekend')||conditie.includes('perfect')) pillClass='pill ok';
    else if(conditie.includes('slecht')||conditie.includes('beschadigd')||conditie.includes('matig')) pillClass='pill bad';

    const imgBlock = item.image ? `
      <div class="img" onclick="openPop('${escapeHtml(item.image)}','${escapeHtml(item.title)}')">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
        <div class="no-img-text" style="display:none">Geen afbeelding beschikbaar</div>
      </div>` : 
      `<div class="img"><div class="no-img-text" style="display:block">Geen afbeelding</div></div>`;

    el.innerHTML = `
      <div class="select-checkbox"><input type="checkbox" data-i="${index}" onchange="toggleSel(${index}, this.checked)"></div>
      ${imgBlock}
      <div class="nr">Nr. ${escapeHtml(item.nr)||'—'}</div>
      <div class="title">${escapeHtml(item.title)||'Zonder titel'}</div>
      <div class="muted">
        ${item.druk?`<strong>Druk:</strong> ${escapeHtml(item.druk)}<br>`:''}
        ${item.bijzonderheden?`<strong>Bijzonderheden:</strong> ${escapeHtml(item.bijzonderheden)}<br>`:''}
      </div>
      <div class="${pillClass}">${escapeHtml(item.conditie)||'Onbekend'}</div>
      ${item.prijs?`<div class="price">€ ${escapeHtml(item.prijs)}</div>`:''}
      ${item.link?`<div><a class="link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener">Bekijk op externe link</a></div>`:''}
    `;
    return el;
  }

  window.openPop = function(src,alt){
    if(!src) return;
    popimg.src=src;
    popimg.alt=alt||'';
    popup.classList.add('show');
    document.body.style.overflow='hidden';
  };

  window.closePop = function(){
    popup.classList.remove('show');
    document.body.style.overflow='auto';
    if(popimg) popimg.onerror=null;
  };

  window.toggleSel = function(i,on){
    if(on) selected.add(i); else selected.delete(i);
    badge.style.display = selected.size ? 'inline-flex' : 'none';
    badge.textContent = selected.size;
    buyBtn.disabled = selected.size === 0;
  };

  buyBtn?.addEventListener('click', function(){
    if(!selected.size) return alert('Selecteer eerst enkele strips om interesse te tonen.');
    const lines = Array.from(selected).map(i=>{
      const x = all[i];
      return `Nr. ${x.nr}: ${x.title}${x.prijs?` (€ ${x.prijs})`:''}`;
    }).join('\n');
    window.location.href = `mailto:david.enker@gmail.com?subject=${encodeURIComponent('Interesse in strips')}&body=${encodeURIComponent(lines)}`;
  });

  grid.innerHTML = '<div class="card"><div class="title">Laden...</div><div class="muted">Bezig met ophalen van gegevens...</div></div>';

  fetch(URL).then(r=>r.text()).then(txt=>{
    const json = JSON.parse(txt.substring(47).slice(0,-2));
    const cols = json.table.cols.map(c=>c.label||''); 
    const rows = json.table.rows||[];

    const I = {
      nr: cols.findIndex(c=>/nr|nummer/i.test(c)),
      title: cols.findIndex(c=>/title|titel|naam/i.test(c)),
      image: cols.findIndex(c=>/image|afbeelding|img/i.test(c)),
      druk: cols.findIndex(c=>/druk|datum|jaar/i.test(c)),
      conditie: cols.findIndex(c=>/conditie|staat/i.test(c)),
      bijzonderheden: cols.findIndex(c=>/bijzonderheden|notities|opmerkingen/i.test(c)),
      link: cols.findIndex(c=>/link|url/i.test(c)),
      prijs: cols.findIndex(c=>/prijs|€|euro|cost/i.test(c)),
      categorie: cols.findIndex(c=>/categorie|serie/i.test(c))
    };

    rows.forEach(r=>{
      const c=r.c||[];
      const v=i=>(c[i]&&c[i].v)?c[i].v.toString().trim():'';

      // NEW: robust filtering
      const cat = I.categorie!==-1 ? v(I.categorie).toLowerCase().trim() : '';
      if(I.categorie!==-1 && !cat.includes(PAGE_NAME)) return;

      const item = {
        nr: v(I.nr),
        title: v(I.title),
        image: v(I.image)||genImg(v(I.nr),v(I.title)),
        druk: v(I.druk),
        conditie: v(I.conditie),
        bijzonderheden: v(I.bijzonderheden),
        link: v(I.link),
        prijs: v(I.prijs)
      };
      all.push(item);
      grid.appendChild(createCard(item, all.length-1));
    });

    if(!all.length){
      grid.innerHTML = '<div class="card"><div class="title">Geen items gevonden</div><div class="muted">Controleer of de categorie-kolom correct is ingevuld.</div></div>';
    }
  }).catch(err=>{
    console.error(err);
    grid.innerHTML = '<div class="card"><div class="title">Laden mislukt</div><div class="muted">Controleer je internetverbinding of Sheet publicatie-instellingen.</div></div>';
  });

})();
