
(()=>{
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 $$('.faq button').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq');item.classList.toggle('open');btn.setAttribute('aria-expanded',String(item.classList.contains('open')))}));
 const search=$('#topSearch'); search?.addEventListener('keydown',e=>{if(e.key==='Enter'){const q=search.value.trim(); if(q) location.href='master-agents.html?q='+encodeURIComponent(q)}});
 const page=location.pathname.split('/').pop()||'index.html'; $$('[data-nav]').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active')});
})();
