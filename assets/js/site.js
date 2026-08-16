(()=>{
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const page=location.pathname.split('/').pop()||'index.html';
 const SEARCH_DATA=[
  {name:'মেহেদী হাসান',alt:'Mehedi Hassan',id:'M01',tier:'Master Agent',phone:'+8801700000001',url:'master-agents.html'},
  {name:'নাদিয়া রহমান',alt:'Nadia Rahman',id:'M02',tier:'Master Agent',phone:'+8801700000002',url:'master-agents.html'},
  {name:'সামিউল করিম',alt:'Samiul Karim',id:'M03',tier:'Master Agent',phone:'+8801700000003',url:'master-agents.html'},
  {name:'তানিয়া সুলতানা',alt:'Tania Sultana',id:'M04',tier:'Master Agent',phone:'+8801700000004',url:'master-agents.html'},
  {name:'আরিফ রহমান',alt:'Arif Rahman',id:'S01',tier:'Super Agent',phone:'+8801700000011',url:'super-agents.html'},
  {name:'মালিহা নূর',alt:'Maliha Noor',id:'S02',tier:'Super Agent',phone:'+8801700000012',url:'super-agents.html'},
  {name:'রাফি আহমেদ',alt:'Rafi Ahmed',id:'S03',tier:'Super Agent',phone:'+8801700000013',url:'super-agents.html'},
  {name:'রুমানা হক',alt:'Rumana Haque',id:'S04',tier:'Super Agent',phone:'+8801700000014',url:'super-agents.html'},
  {name:'রাশেদ চৌধুরী',alt:'Rashed Chowdhury',id:'A01',tier:'Admin',phone:'+8801700000021',url:'admin.html'},
  {name:'শারমিন আক্তার',alt:'Sharmin Akter',id:'A02',tier:'Admin',phone:'+8801700000022',url:'admin.html'},
  {name:'মেহেদী হাসান',alt:'Mehedi Hassan',id:'01',tier:'Quick Master Agent',phone:'+8801700000000',url:'index.html'}
 ];
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const initials=n=>n.split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
 const lock=on=>document.body.classList.toggle('ui-locked',!!on);

 $$('[data-nav]').forEach(a=>{if(a.getAttribute('href')===page){a.classList.add('active');a.setAttribute('aria-current','page')}});
 $$('.faq button').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq'),open=item.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));const arrow=$('.arrow',btn);if(arrow)arrow.textContent=open?'⌃':'⌄'}));

 const searchOverlay=document.createElement('section');
 searchOverlay.className='search-overlay';searchOverlay.id='searchOverlay';searchOverlay.setAttribute('role','dialog');searchOverlay.setAttribute('aria-modal','true');searchOverlay.setAttribute('aria-label','Agent search');
 searchOverlay.innerHTML=`<div class="search-overlay__bar"><div class="search-overlay__bar-inner"><label class="search-overlay__input-wrap"><span class="search-overlay__icon">⌕</span><span class="sr-only">এজেন্ট খুঁজুন</span><input class="search-overlay__input" id="globalSearchInput" type="search" autocomplete="off" placeholder="এজেন্টের নাম, ID বা নাম্বার দিয়ে খুঁজুন..."></label><button class="search-overlay__close" id="searchClose" type="button">বন্ধ করুন</button></div></div><div class="search-overlay__content" id="searchContent"></div>`;
 document.body.appendChild(searchOverlay);
 const searchInput=$('#globalSearchInput'),searchContent=$('#searchContent');
 const empty=()=>{searchContent.innerHTML='<div class="search-empty"><div class="search-empty__icon"></div><h2>আপনার এজেন্টকে খুঁজুন</h2><p>নাম, Agent ID অথবা phone number লিখুন।<br>Matching profile থাকলে এখানে দেখাবে।</p></div>'};
 const render=()=>{const q=searchInput.value.trim().toLowerCase();if(!q){empty();return}const list=SEARCH_DATA.filter(a=>`${a.name} ${a.alt} ${a.id} ${a.tier} ${a.phone}`.toLowerCase().includes(q));if(!list.length){searchContent.innerHTML='<div class="search-no-result"><strong>কোনো matching profile পাওয়া যায়নি</strong><span>নাম, ID অথবা number আবার check করুন।</span></div>';return}searchContent.innerHTML=`<div class="search-results"><p class="search-summary">${list.length}টি matching profile পাওয়া গেছে</p>${list.map(a=>`<article class="search-result-card"><span class="search-result-card__avatar">${escape(initials(a.alt))}</span><div><strong>${escape(a.name)}</strong><small>${escape(a.tier)} · ${escape(a.phone)}</small><span class="search-result-card__id">ID ${escape(a.id)}</span></div><button class="search-result-card__open" data-open-url="${escape(a.url)}" type="button">দেখুন</button></article>`).join('')}</div>`};
 const openSearch=(seed='')=>{closeChat();searchOverlay.classList.add('open');lock(true);searchInput.value=seed;render();setTimeout(()=>searchInput.focus(),25)};
 const closeSearch=()=>{searchOverlay.classList.remove('open');lock(false)};
 empty();searchInput.addEventListener('input',render);$('#searchClose').addEventListener('click',closeSearch);searchContent.addEventListener('click',e=>{const b=e.target.closest('[data-open-url]');if(b)location.href=b.dataset.openUrl});
 $$('.global-search-trigger').forEach(b=>b.addEventListener('click',()=>openSearch()));
 const inline=$('#inlineSearch'),inlineBtn=$('#inlineSearchBtn');inlineBtn?.addEventListener('click',()=>openSearch(inline?.value||''));inline?.addEventListener('keydown',e=>{if(e.key==='Enter')openSearch(inline.value)});

 const chat=document.createElement('section');chat.className='chat-widget';chat.setAttribute('role','dialog');chat.setAttribute('aria-label','Live support');
 chat.innerHTML=`<div class="chat-widget__head"><span class="chat-widget__head-icon">☏</span><div><strong>লাইভ সাপোর্ট</strong><small>● Support online</small></div><button class="chat-widget__close" id="chatClose" type="button" aria-label="চ্যাট বন্ধ করুন">×</button></div><div class="chat-widget__body"><div class="chat-message"><div class="chat-message__meta"><strong>Customer Care</strong><span>Demo response flow</span></div><p>আসসালামু আলাইকুম! Agent ID বা listing নিয়ে কোনো প্রশ্ন থাকলে নিচে লিখুন।</p></div><div class="chat-contact"><span>Support number</span><strong>+8801000000000</strong></div><div class="chat-compose"><label class="sr-only" for="chatMessage">আপনার মেসেজ</label><input id="chatMessage" type="text" placeholder="আপনার মেসেজ..."><button class="chat-whatsapp" id="chatWhatsapp" type="button">☏ WhatsApp-এ চ্যাট করুন</button></div></div>`;
 document.body.appendChild(chat);const chatPill=document.createElement('button');chatPill.className='chat-close-pill';chatPill.type='button';chatPill.textContent='×  চ্যাট বন্ধ';document.body.appendChild(chatPill);const chatInput=$('#chatMessage');
 function openChat(prefill=''){closeSearch();chat.classList.add('open');chatPill.classList.add('open');if(prefill)chatInput.value=prefill;setTimeout(()=>chatInput.focus(),30)}
 function closeChat(){chat.classList.remove('open');chatPill.classList.remove('open')}
 $('#liveChatBtn')?.addEventListener('click',()=>openChat());$$('.open-chat').forEach(b=>b.addEventListener('click',()=>openChat(`${b.dataset.agent||''}${b.dataset.id?' (ID '+b.dataset.id+')':''} সম্পর্কে জানতে চাই।`.trim())));$('#chatClose').addEventListener('click',closeChat);chatPill.addEventListener('click',closeChat);$('#chatWhatsapp').addEventListener('click',()=>{const msg=chatInput.value.trim()||'Hello, I need help checking a demo agent listing.';window.open('https://wa.me/8801000000000?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')});
 $$('.action.green').forEach(btn=>btn.addEventListener('click',()=>{const c=btn.closest('.panel');openChat(`${$('.agent-name',c)?.textContent.trim()||'Agent'} (ID ${$('.agent-id b',c)?.textContent.trim()||''}) সম্পর্কে জানতে চাই।`)}));
 $$('.action.red').forEach(btn=>btn.addEventListener('click',()=>{const c=btn.closest('.panel'),id=$('.agent-id b',c)?.textContent.trim()||'';location.href='customer-service.html'+(id?'?topic=report&id='+encodeURIComponent(id):'')}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(searchOverlay.classList.contains('open'))closeSearch();else if(chat.classList.contains('open'))closeChat()}});
})();
