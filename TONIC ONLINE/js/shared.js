// shared utilities: include loader + mobile menu helper
(function(){
  // Insert HTML includes into elements with data-include attribute
  async function loadIncludes(){
    const nodes = document.querySelectorAll('[data-include]');
    for(const node of nodes){
      const src = node.getAttribute('data-include');
      try{
        const res = await fetch(src);
        if(!res.ok) throw new Error(res.status);
        node.innerHTML = await res.text();
      }catch(e){
        console.error('include failed', src, e);
      }
    }
  }

  // Close mobile nav when a link is clicked
  function attachNavClose(){
    document.addEventListener('click', function(e){
      const t = e.target;
      if(t.closest && t.closest('#main-nav')){
        const toggle = document.getElementById('menu-toggle');
        if(toggle && toggle.checked) toggle.checked = false;
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ loadIncludes(); attachNavClose(); });
  }else{ loadIncludes(); attachNavClose(); }
})();
