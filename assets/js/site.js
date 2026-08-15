(()=>{
  const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const agents=window.AGENTS||[];
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const initials=name=>String(name||'A').split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const current=location.pathname.split('/').pop()||'index.html';

  function navigation(){
    $$('.desktop-nav a,.drawer-links a,.bottom-nav a').forEach(a=>{
      const href=(a.getAttribute('href')||'').split('#')[0];
      const group=a.dataset.group;
      const grouped=(group==='directory'&&['master-agents.html','super-agents.html','sub-admins.html'].includes(current))||(group==='help'&&['faq.html','how-it-works.html'].includes(current));
      if(href===current||grouped)a.classList.add('active');
    });
    const drawer=$('#drawer'),open=$('#menuBtn'),close=$('#drawerClose'),back=$('.drawer-backdrop');
    const set=v=>{if(!drawer)return;drawer.classList.toggle('open',v);drawer.setAttribute('aria-hidden',String(!v));if(open)open.setAttribute('aria-expanded',String(v));};
    open?.addEventListener('click',()=>set(true));close?.addEventListener('click',()=>set(false));back?.addEventListener('click',()=>set(false));
    addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
  }

  function card(a){
    const limited=a.status==='Limited';
    return `<article class="agent-card">
      <div class="agent-top"><div class="avatar">${esc(initials(a.name))}</div><div class="agent-info"><div class="agent-name-row"><h2>${esc(a.name)}</h2></div><p>${esc(a.tier)} · ${esc(a.area)}</p></div><span class="status-badge ${limited?'limited':''}">${esc(a.status)}</span></div>
      <div class="agent-meta"><div><span>Profile ID</span><strong>${esc(a.id)}</strong></div><div><span>Rating</span><strong>${Number(a.rating).toFixed(1)} / 5</strong></div><div><span>Language</span><strong>${esc(a.language)}</strong></div><div><span>Checks</span><strong>${esc(a.checks)}</strong></div></div>
      <div class="agent-actions"><a class="btn" href="customer-service.html">Verify profile</a><a class="btn btn-soft" href="customer-service.html">Support</a></div>
    </article>`;
  }

  function directory(){
    const grid=$('[data-agent-grid]');if(!grid)return;
    const tier=grid.dataset.tier||'',search=$('#search'),area=$('#area'),status=$('#status'),count=$('#count'),reset=$('#reset');
    const base=agents.filter(a=>!tier||a.tier===tier);
    [...new Set(base.map(a=>a.area))].sort().forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;area?.appendChild(o)});
    const render=()=>{
      const q=(search?.value||'').trim().toLowerCase(),av=area?.value||'',sv=status?.value||'';
      const list=base.filter(a=>(!av||a.area===av)&&(!sv||a.status===sv)&&(!q||`${a.name} ${a.id} ${a.area} ${a.language}`.toLowerCase().includes(q)));
      grid.innerHTML=list.length?list.map(card).join(''):'<div class="empty">No matching profiles. Try another name, ID, area or status.</div>';
      if(count)count.textContent=`${list.length} profile${list.length===1?'':'s'} shown`;
    };
    search?.addEventListener('input',render);area?.addEventListener('change',render);status?.addEventListener('change',render);reset?.addEventListener('click',()=>{if(search)search.value='';if(area)area.value='';if(status)status.value='';render()});render();
  }

  function homeSearch(){
    const input=$('#hubSearch'),button=$('#verifyButton'),msg=$('#searchMessage');if(!input||!button)return;
    const fill=a=>{
      $('#profileAvatar').textContent=initials(a.name);$('#profileTitle').textContent=a.name;$('#profileMeta').textContent=`${a.tier} · ${a.area}`;$('#profileId').textContent=a.id;$('#profileRating').textContent=`${Number(a.rating).toFixed(1)} / 5`;$('#profileChecks').textContent=a.checks;const s=$('#profileStatus');s.textContent=a.status;s.classList.toggle('limited',a.status==='Limited');const dir=$('#viewDirectory');dir.href=a.tier==='Master Agent'?'master-agents.html':a.tier==='Super Agent'?'super-agents.html':'sub-admins.html';
    };
    const run=()=>{const q=input.value.trim().toLowerCase();if(!q){msg.textContent='Enter a profile ID, name or area.';return}const exact=agents.find(a=>a.id.toLowerCase()===q);const hit=exact||agents.find(a=>`${a.name} ${a.id} ${a.area}`.toLowerCase().includes(q));if(hit){fill(hit);msg.textContent=`Matched ${hit.id}. Confirm current details with support if needed.`}else msg.textContent='No matching sample profile found.';};
    button.addEventListener('click',run);input.addEventListener('keydown',e=>{if(e.key==='Enter')run()});
  }

  function faq(){
    $$('.faq button').forEach(b=>b.addEventListener('click',()=>{const item=b.closest('.faq');const open=item.classList.toggle('open');b.setAttribute('aria-expanded',String(open))}));
  }
  function form(){const f=$('#contactForm');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const m=$('#formMsg');m.hidden=false;m.textContent='Demo request received locally. Connect this form to your email, CRM or backend before launch.';f.reset()})}
  navigation();directory();homeSearch();faq();form();
})();
