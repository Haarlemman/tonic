(function(){
  const SHEET_ID = window.SHEET_ID;
  const GID = window.GID;
  const PAGE_NAME = window.PAGE_NAME;
  const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
  const grid = document.getElementById('grid');
  const buyBtn = document.getElementById('buyBtn');
  const badge = document.getElementById('badge');
  const popup = document.getElementById('popup');
  const popimg = document.getElementById('popimg');

  const selected = new Set();
  const all = [];

  function escapeHtml(text){ return text ? text.toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }

  function openPop(src, alt){
    if(!src) return;
    popimg.src = src;
    popimg.alt = alt||'';
    popup.classList.add('show');
    document.body.style.overflow='hidden';
  }

  function closePop(){
    popup.classList.remove('show');
    document.body.style.overflow='auto';
    popimg.onerror = null;
  }

  window.openPop=openPop;
  window.closePop=closePop;

  function toggleSel(i,on){
    if(on) selected.add(i); else selected.delete(i);
    const n = selected.size;
    buyBtn.disabled = n===0;
    badge.style.display = n? 'inline-flex':'none';
    badge.textContent = n;
  }
  window.toggleSel=toggleSel;

  function createCard(item, index){
    const el = document.createElement('div');
    el.className='card';
    el.dataset.index=index;

    const imgSrc = escapeHtml(item.cover);
    const imgAlt = escapeHtml(item.Title || 'Strip afbeelding');
    const imgBlock = imgSrc ? `<div class="img" onclick="openPop('${imgSrc}','${imgAlt}')">
      <img src="${imgSrc}" alt="${imgAlt}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
      <div style="display:none;padding:10px;text-align:center;color:#666;">Geen afbeelding beschikbaar</div>
    </div>` : `<div class="img"><div style="padding:10px;text-align:center;color:#666;">Geen afbeelding</div></div>`;

    el.innerHTML = `
      <div class="select-checkbox"><input type="checkbox" data-i="${index}" onchange="toggleSel(${index}, this.checked)"></div>
      ${imgBlock}
      <div class="title">${escapeHtml(item.Title)}</div>
      ${item.Year||item.Edition ? `<div class="muted">${item.Year||''} ${item.Edition||''}</div>` : ''}
      ${item.prijs ? `<div class="price">€ ${escapeHtml(item.prijs)}</div>` : ''}
      ${item['LastDodo Link'] ? `<div><a class="link" href="${escapeHtml(item['LastDodo Link'])}" target="_blank" rel="noopener">Bekijk op LastDodo</a></div>` : ''}
    `;
    return el;
  }

  fetch(URL)
    .then(r=>r.text())
    .then(txt=>{
      const json = JSON.parse(txt.substring(47).slice(0,-2));
      const cols = json.table.cols.map(c=>c.label||'');
      const rows = json.table.rows || [];
      grid.innerHTML='';

      rows.forEach((r,i)=>{
        const c=r.c||[];
        const rowObj={};
        cols.forEach((label,j)=>{ rowObj[label]=c[j] ? c[j].v : ''; });
        if(rowObj.Serie && rowObj.Serie.toLowerCase().includes(PAGE_NAME.toLowerCase())){
          all.push(rowObj);
          grid.appendChild(createCard(rowObj, all.length-1));
        }
      });

      if(all.length===0){
        grid.innerHTML=`<div class="card"><div class="title">Geen items gevonden</div></div>`;
      }
    })
    .catch(err=>{
      console.error(err);
      grid.innerHTML=`<div class="card"><div class="title">Fout bij laden</div></div>`;
    });

  if(buyBtn){
    buyBtn.addEventListener('click',()=>{
      if(selected.size===0) return alert('Selecteer eerst enkele strips');
      const lines = Array.from(selected).map(i=>{
        const x=all[i];
        return `${x.Title}${x.prijs ? ' (€'+x.prijs+')':''}`;
      }).join('\n');
      const mailto = `mailto:david.enker@gmail.com?subject=${encodeURIComponent('Interesse in strips')}&body=${encodeURIComponent(lines)}`;
      window.location.href=mailto;
    });
  }

  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closePop(); });
  popup.addEventListener('click', e=>{ if(e.target===popup) closePop(); });

})();
