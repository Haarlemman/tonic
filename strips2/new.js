(function(){
  const PAGE_CONFIG = window.PAGE_CONFIG;
  const SHEET_ID = window.SHEET_ID;

  if(!PAGE_CONFIG || !SHEET_ID) return console.error('Missing PAGE_CONFIG or SHEET_ID');

  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${PAGE_CONFIG.gid}`;
  const grid = document.getElementById('grid');
  const buyBtn = document.getElementById('buyBtn');
  const badge = document.getElementById('badge');
  const popup = document.getElementById('popup');
  const popimg = document.getElementById('popimg');

  const all = [];
  const selected = new Set();

  function escapeHtml(text){ return text ? text.toString().replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])) : ''; }
  function genImg(nr,title){ return `https://davidenker.com/strips/images/${nr}${title.toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,10)}.jpg`; }

  function findIndex(cols,names){ names=names.map(n=>n.toLowerCase()); for(let i=0;i<cols.length;i++){ const l=(cols[i]||'').toLowerCase(); if(names.includes(l)) return i; for(const n of names) if(l.indexOf(n)!==-1) return i; } return -1; }

  function createCard(item,index){
    const el=document.createElement('div'); el.className='card';
    el.dataset.index=index;

    const conditie=(item.conditie||'').toLowerCase();
    let pillClass='pill';
    if(conditie.includes('goed')||conditie.includes('perfect')||conditie.includes('uitstekend')) pillClass='pill ok';
    else if(conditie.includes('slecht')||conditie.includes('beschadigd')||conditie.includes('matig')) pillClass='pill bad';

    const imgSrc = escapeHtml(item.image||'');
    const imgAlt = escapeHtml(item.title||'Strip afbeelding');
    const imgBlock = imgSrc ? `<div class="img" onclick="openPop('${imgSrc}','${imgAlt}')">
      <img src="${imgSrc}" alt="${imgAlt}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
      <div style="display:none;padding:20px;color:#666;text-align:center;font-size:12px;border:1px dashed #ddd;border-radius:4px;">Geen afbeelding beschikbaar</div>
    </div>` : `<div class="img"><div style="padding:20px;color:#666;text-align:center;font-size:12px;">Geen afbeelding</div></div>`;

    el.innerHTML=`
      <div class="select-checkbox"><input type="checkbox" data-i="${index}" onchange="toggleSel(${index},this.checked)"></div>
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

  window.openPop=function(src,alt){ if(!src) return; popimg.src=src; popimg.alt=alt||''; popup.classList.add('show'); document.body.style.overflow='hidden'; }
  window.closePop=function(){ popup.classList.remove('show'); document.body.style.overflow='auto'; popimg.onerror=null; }
  window.toggleSel=function(i,on){ if(i<0||i>=all.length)return; on?selected.add(i):selected.delete(i); badge.style.display=selected.size?'inline-flex':'none'; badge.textContent=selected.size; buyBtn.disabled=!selected.size; }

  if(grid) grid.innerHTML=`<div class="card"><div class="title">Laden...</div><div class="muted">Bezig met ophalen van gegevens...</div></div>`;

  fetch(URL).then(r=>r.text()).then(txt=>{
    const jsonText = txt.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/)[1];
    const json = JSON.parse(jsonText);

    const cols=json.table.cols.map(c=>c.label||''), rows=json.table.rows||[];
    const I={}; Object.keys(PAGE_CONFIG.columns).forEach(k=>I[k]=findIndex(cols,PAGE_CONFIG.columns[k]));

    grid.innerHTML='';
    rows.forEach((r,idx)=>{
      const c=r.c||[]; 
      const v=i=>i==null||!c[i]||c[i].v==null?'':c[i].v.toString().trim();
      if(PAGE_CONFIG.filterColumn && PAGE_CONFIG.filterValue && v(I[PAGE_CONFIG.filterColumn])!==PAGE_CONFIG.filterValue) return;

      const item={}; Object.keys(I).forEach(k=>item[k]=v(I[k]));
      if(!item.image && item.nr && item.title) item.image=genImg(item.nr,item.title);
      all.push(item);
      grid.appendChild(createCard(item,all.length-1));
    });

  }).catch(err=>{ console.error('Error fetching sheet:',err); grid.innerHTML=`<div class="card"><div class="title">Laden mislukt</div><div class="muted">${err.message}</div></div>` });

})();
