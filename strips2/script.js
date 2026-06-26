/* script.js */
(function(){
  const SHEET_ID = window.SHEET_ID;
  const cfg = window.PAGE_CONFIG;
  if(!SHEET_ID || !cfg || !cfg.filterColumn) return console.error("Missing SHEET_ID or PAGE_CONFIG");

  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${cfg.gid||0}`;
  const grid = document.getElementById('grid');
  const buyBtn = document.getElementById('buyBtn');
  const badge = document.getElementById('badge');
  const popup = document.getElementById('popup');
  const popimg = document.getElementById('popimg');
  const all=[], selected=new Set();

  function escapeHtml(text){ if(!text) return ''; const div=document.createElement('div'); div.textContent=text; return div.innerHTML; }
  function findIndex(cols,names){ names=names.map(n=>n.toLowerCase()); for(let i=0;i<cols.length;i++){ const label=(cols[i]||'').toLowerCase().trim(); if(names.includes(label)) return i; for(const n of names) if(label.indexOf(n)!==-1) return i; } return -1; }
  function createImageErrorHandler(){ return `this.style.display='none'; this.nextElementSibling.style.display='block'`; }
  function genImg(nr,title){ const short=(title||'').toLowerCase().replace(/^(de |het |een |der )/i,'').replace(/[^a-z0-9]/g,'').substring(0,10); return `https://davidenker.com/strips/images/${nr}${short}.jpg`; }

  function createCard(item,index){
    const el=document.createElement('div'); el.className='card'; el.dataset.index=index;
    const imgSrc=escapeHtml(item.image||''), imgAlt=escapeHtml(item.title||'Strip afbeelding');
    const imgBlock = imgSrc ? `<div class="img" onclick="openPop('${imgSrc.replace(/'/g,"&#39;")}','${imgAlt.replace(/'/g,"&#39;")}')">
      <img src="${imgSrc}" alt="${imgAlt}" onerror="${createImageErrorHandler()}">
      <div style="display:none;padding:20px;color:#666;text-align:center;font-size:12px;border:1px dashed #ddd;border-radius:4px;">Geen afbeelding beschikbaar</div>
    </div>` : `<div class="img"><div style="padding:20px;color:#666;text-align:center;font-size:12px;">Geen afbeelding</div></div>`;

    let pillClass='pill';
    const cond=(item.conditie||'').toLowerCase();
    if(cond.includes('goed')||cond.includes('uitstekend')||cond.includes('perfect')) pillClass='pill ok';
    else if(cond.includes('slecht')||cond.includes('beschadigd')||cond.includes('matig')) pillClass='pill bad';

    el.innerHTML=`
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

  window.openPop=function(src,alt){ if(!src) return; popimg.src=src; popimg.alt=alt||''; popup.classList.add('show'); document.body.style.overflow='hidden'; }
  window.closePop=function(){ popup.classList.remove('show'); document.body.style.overflow='auto'; popimg.onerror=null; }
  window.toggleSel=function(i,on){ if(i<0||i>=all.length)return; on?selected.add(i):selected.delete(i); badge.style.display=selected.size?'inline-flex':'none'; badge.textContent=selected.size; buyBtn.disabled=!selected.size; }

  if(buyBtn) buyBtn.addEventListener('click',function(){
    if(selected.size===0) return alert('Selecteer eerst enkele strips');
    const lines=Array.from(selected).map(i=>{ const x=all[i]; return `Nr. ${x.nr}: ${x.title}${x.prijs?` (€ ${x.prijs})`:''}`; }).join('\n');
    const subject=encodeURIComponent('Interesse in strips (davidenker.com)');
    const body=encodeURIComponent(`Beste David,\n\nIk heb interesse in de volgende strips:\n\n${lines}\n\nZijn ze beschikbaar en wat zijn de verzendkosten?\n\nMet vriendelijke groet,`);
    window.location.href=`mailto:david.enker@gmail.com?subject=${subject}&body=${body}`;
  });

  if(grid) grid.innerHTML=`<div class="card"><div class="title">Laden...</div><div class="muted">Bezig met ophalen van gegevens...</div></div>`;

  fetch(URL).then(r=>r.text()).then(txt=>{
    const json=JSON.parse(txt.substring(47).slice(0,-2));
    const cols=json.table.cols.map(c=>c.label||''), rows=json.table.rows||[];

    // column mapping
    const I = {};
    Object.keys(cfg.columns).forEach(k=>{
      I[k]=findIndex(cols,cfg.columns[k]);
    });

    grid.innerHTML='';
    rows.forEach((r,idx)=>{
      const c=r.c||[];
      const v=i=>i==null||!c[i]||c[i].v==null?'':c[i].v.toString().trim();
      const item={};
      Object.keys(I).forEach(k=>{ item[k]=v(I[k]); });
      // filter by page
      if(cfg.filterColumn && cfg.filterValue && v(I[cfg.filterColumn])!==cfg.filterValue) return;
      if(!item.image && item.nr && item.title) item.image=genImg(item.nr,item.title);
      all.push(item);
      grid.appendChild(createCard(item,all.length-1));
    });

  }).catch(err=>{ console.error(err); grid.innerHTML=`<div class="card"><div class="title">Laden mislukt</div><div class="muted">${err.message}</div></div>` });

})();
