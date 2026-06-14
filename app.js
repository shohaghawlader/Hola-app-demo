(() => {
  'use strict';

  const DB_KEY = 'voxa_demo_db_v2';
  const SESSION_KEY = 'voxa_demo_session_v2';
  const SETTINGS_KEY = 'voxa_demo_settings_v2';

  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const toastRoot = document.getElementById('toast-root');

  let deferredInstallPrompt = null;
  let speakingTimer = null;

  const translations = {
    bn: {
      welcome: 'স্বাগতম', login: 'লগইন', register: 'রেজিস্টার', email: 'ইমেইল', password: 'পাসওয়ার্ড', name: 'পুরো নাম', username: 'ইউজারনেম',
      home: 'হোম', discover: 'ডিসকভার', create: 'তৈরি করুন', notifications: 'নোটিফিকেশন', profile: 'প্রোফাইল',
      popularRooms: 'জনপ্রিয় রুম', onlineNow: 'এখন অনলাইনে', topHosts: 'সেরা হোস্ট', seeAll: 'সব দেখুন',
      search: 'রুম বা মানুষ খুঁজুন', coins: 'কয়েন ব্যালেন্স', demoBalance: 'ডেমো ব্যালেন্স', join: 'জয়েন', follow: 'ফলো', following: 'ফলোয়িং',
      editProfile: 'প্রোফাইল এডিট', wallet: 'ওয়ালেট ও হিস্ট্রি', leaderboard: 'লিডারবোর্ড', settings: 'সেটিংস', admin: 'অ্যাডমিন প্যানেল', logout: 'লগআউট',
      createRoom: 'নতুন রুম তৈরি', roomTitle: 'রুমের নাম', category: 'ক্যাটাগরি', description: 'সংক্ষিপ্ত বর্ণনা', roomCreated: 'রুম তৈরি হয়েছে',
      sendGift: 'গিফট পাঠান', requestMic: 'মাইক চান', leave: 'বের হন', chat: 'চ্যাট', audience: 'অডিয়েন্স', message: 'মেসেজ লিখুন…', send: 'পাঠান',
      language: 'ভাষা', appearance: 'থিম', install: 'অ্যাপ ইনস্টল', close: 'বন্ধ করুন', save: 'সেভ করুন', cancel: 'বাতিল',
      weekly: 'সাপ্তাহিক', monthly: 'মাসিক', allTime: 'সর্বকালীন', earnings: 'আয়', followers: 'ফলোয়ার', rooms: 'রুম',
      demoNotice: 'এটি API ছাড়া একটি কার্যকর demo। Voice, payment ও withdrawal simulation হিসেবে দেখানো হয়।',
      loginSubtitle: 'নতুন মানুষের সঙ্গে পরিচিত হন, রুমে যোগ দিন এবং কমিউনিটি তৈরি করুন।',
      guest: 'গেস্ট', host: 'হোস্ট', adminRole: 'অ্যাডমিন', noResults: 'কিছু পাওয়া যায়নি', report: 'রিপোর্ট', block: 'ব্লক',
      micRequested: 'মাইক রিকোয়েস্ট পাঠানো হয়েছে', micOn: 'মাইক চালু', micOff: 'মাইক বন্ধ', notEnoughCoins: 'পর্যাপ্ত কয়েন নেই', giftSent: 'গিফট পাঠানো হয়েছে',
      guestLogin: 'Demo account দিয়ে দেখুন', themeChanged: 'থিম পরিবর্তন হয়েছে', profileSaved: 'প্রোফাইল আপডেট হয়েছে',
      roomLocked: 'রুম লক করা হয়েছে', roomUnlocked: 'রুম আনলক করা হয়েছে', copied: 'রুম লিংক কপি হয়েছে', member: 'সদস্য', online: 'অনলাইন'
    },
    en: {
      welcome: 'Welcome', login: 'Login', register: 'Register', email: 'Email', password: 'Password', name: 'Full name', username: 'Username',
      home: 'Home', discover: 'Discover', create: 'Create', notifications: 'Notifications', profile: 'Profile',
      popularRooms: 'Popular rooms', onlineNow: 'Online now', topHosts: 'Top hosts', seeAll: 'See all',
      search: 'Search rooms or people', coins: 'Coin balance', demoBalance: 'Demo balance', join: 'Join', follow: 'Follow', following: 'Following',
      editProfile: 'Edit profile', wallet: 'Wallet & history', leaderboard: 'Leaderboard', settings: 'Settings', admin: 'Admin panel', logout: 'Log out',
      createRoom: 'Create a new room', roomTitle: 'Room title', category: 'Category', description: 'Short description', roomCreated: 'Room created',
      sendGift: 'Send gift', requestMic: 'Request mic', leave: 'Leave', chat: 'Chat', audience: 'Audience', message: 'Write a message…', send: 'Send',
      language: 'Language', appearance: 'Theme', install: 'Install app', close: 'Close', save: 'Save', cancel: 'Cancel',
      weekly: 'Weekly', monthly: 'Monthly', allTime: 'All time', earnings: 'Earnings', followers: 'Followers', rooms: 'Rooms',
      demoNotice: 'This is a functional API-free demo. Voice, payment and withdrawal are simulated.',
      loginSubtitle: 'Meet new people, join rooms and build your community.',
      guest: 'Guest', host: 'Host', adminRole: 'Admin', noResults: 'Nothing found', report: 'Report', block: 'Block',
      micRequested: 'Mic request sent', micOn: 'Mic enabled', micOff: 'Mic muted', notEnoughCoins: 'Not enough coins', giftSent: 'Gift sent',
      guestLogin: 'Explore with a demo account', themeChanged: 'Theme changed', profileSaved: 'Profile updated',
      roomLocked: 'Room locked', roomUnlocked: 'Room unlocked', copied: 'Room link copied', member: 'members', online: 'online'
    }
  };

  const state = {
    view: 'home',
    authMode: 'login',
    roomId: null,
    roomPanel: 'chat',
    category: 'All',
    search: '',
    leaderboardPeriod: 'weekly',
    splash: true,
    micOn: false
  };

  const settings = loadJSON(SETTINGS_KEY, { language: 'bn', theme: 'light' });
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.lang = settings.language;

  let db = loadJSON(DB_KEY, null) || seedDatabase();
  persistDb();
  let currentUserId = localStorage.getItem(SESSION_KEY) || null;

  function seedDatabase() {
    return {
      users: [
        { id: 'u1', name: 'Nusrat Jahan', username: 'nusrat.live', email: 'host@voxa.demo', password: 'demo123', role: 'host', coins: 2450, earnings: 12840, followers: 18400, following: ['u2','u3'], bio: 'Music, stories and friendly conversations.', avatar: '', colors: ['#7a4cf8','#e56daf'], status: 'active', online: true },
        { id: 'u2', name: 'Arian Ahmed', username: 'arian.voice', email: 'guest@voxa.demo', password: 'demo123', role: 'user', coins: 860, earnings: 420, followers: 920, following: ['u1'], bio: 'Tech enthusiast and night owl.', avatar: '', colors: ['#2193b0','#6dd5ed'], status: 'active', online: true },
        { id: 'u3', name: 'Maya Rahman', username: 'maya.talks', email: 'maya@voxa.demo', password: 'demo123', role: 'host', coins: 1820, earnings: 8920, followers: 12700, following: ['u1','u2'], bio: 'Books, wellbeing and open conversations.', avatar: '', colors: ['#ff7e5f','#feb47b'], status: 'active', online: true },
        { id: 'u4', name: 'Rafi Khan', username: 'rafi.music', email: 'rafi@voxa.demo', password: 'demo123', role: 'host', coins: 1270, earnings: 6810, followers: 9800, following: ['u3'], bio: 'Acoustic nights and requests.', avatar: '', colors: ['#11998e','#38ef7d'], status: 'active', online: true },
        { id: 'u5', name: 'Sadia Noor', username: 'sadia.cafe', email: 'sadia@voxa.demo', password: 'demo123', role: 'user', coins: 940, earnings: 90, followers: 530, following: ['u1','u3'], bio: 'Coffee, movies and calm people.', avatar: '', colors: ['#ee0979','#ff6a00'], status: 'active', online: false },
        { id: 'u6', name: 'Tanvir Hasan', username: 'tanvir.games', email: 'tanvir@voxa.demo', password: 'demo123', role: 'host', coins: 2200, earnings: 7150, followers: 11200, following: ['u1'], bio: 'Games, challenges and fun.', avatar: '', colors: ['#4776e6','#8e54e9'], status: 'active', online: true },
        { id: 'admin', name: 'Voxa Admin', username: 'voxa.admin', email: 'admin@voxa.demo', password: 'admin123', role: 'admin', coins: 99999, earnings: 0, followers: 0, following: [], bio: 'Platform administrator.', avatar: '', colors: ['#232526','#414345'], status: 'active', online: true }
      ],
      rooms: [
        { id:'r1', title:'গানের আড্ডা — Live Requests', titleEn:'Music Lounge — Live Requests', category:'Music', description:'Request your favourite song and meet music lovers.', hostId:'u1', listeners:148, locked:false, theme:1, seats:['u1','u4',null,'u3',null,null,'u2',null], createdAt:Date.now()-820000 },
        { id:'r2', title:'রাত জাগা গল্প', titleEn:'Late Night Stories', category:'Lifestyle', description:'Calm stories and honest conversations after midnight.', hostId:'u3', listeners:96, locked:false, theme:2, seats:['u3','u5',null,null,'u2',null,null,null], createdAt:Date.now()-720000 },
        { id:'r3', title:'Tech Talk Bangladesh', titleEn:'Tech Talk Bangladesh', category:'Tech', description:'Apps, freelancing, gadgets and startup ideas.', hostId:'u2', listeners:71, locked:false, theme:3, seats:['u2','u6',null,null,null,'u4',null,null], createdAt:Date.now()-620000 },
        { id:'r4', title:'Game Night Challenge', titleEn:'Game Night Challenge', category:'Gaming', description:'Mini challenges, quiz and gaming talk.', hostId:'u6', listeners:124, locked:false, theme:4, seats:['u6','u2','u4',null,null,null,null,null], createdAt:Date.now()-520000 },
        { id:'r5', title:'Girls Community Café', titleEn:'Girls Community Café', category:'Community', description:'A friendly and moderated community room.', hostId:'u5', listeners:82, locked:true, theme:5, seats:['u5','u1','u3',null,null,null,null,null], createdAt:Date.now()-420000 },
        { id:'r6', title:'English Practice Club', titleEn:'English Practice Club', category:'Education', description:'Practice speaking through friendly topics and games.', hostId:'u4', listeners:58, locked:false, theme:6, seats:['u4','u2',null,'u3',null,null,null,null], createdAt:Date.now()-320000 }
      ],
      messages: {
        r1: [
          { id:'m1', userId:'system', text:'Nusrat opened the room.', time:Date.now()-580000 },
          { id:'m2', userId:'u2', text:'আজকে একটা পুরোনো বাংলা গান হবে?', time:Date.now()-420000 },
          { id:'m3', userId:'u1', text:'অবশ্যই! নাম বলুন।', time:Date.now()-390000 },
          { id:'m4', userId:'u4', text:'Welcome everyone!', time:Date.now()-260000 }
        ],
        r2: [{ id:'m5', userId:'u3', text:'আজকের বিষয়—ছোট ছোট সুখ।', time:Date.now()-290000 }],
        r3: [{ id:'m6', userId:'u2', text:'আজকে free hosting নিয়ে কথা বলি।', time:Date.now()-250000 }],
        r4: [{ id:'m7', userId:'u6', text:'Quiz starts in five minutes!', time:Date.now()-200000 }],
        r5: [{ id:'m8', userId:'u5', text:'Please keep the room respectful.', time:Date.now()-180000 }],
        r6: [{ id:'m9', userId:'u4', text:'Introduce yourself in two sentences.', time:Date.now()-140000 }]
      },
      gifts: [
        { id:'g1', name:'Rose', emoji:'🌹', price:10 },
        { id:'g2', name:'Coffee', emoji:'☕', price:25 },
        { id:'g3', name:'Star', emoji:'⭐', price:50 },
        { id:'g4', name:'Crown', emoji:'👑', price:120 },
        { id:'g5', name:'Rocket', emoji:'🚀', price:250 },
        { id:'g6', name:'Diamond', emoji:'💎', price:500 },
        { id:'g7', name:'Heart', emoji:'💜', price:75 },
        { id:'g8', name:'Party', emoji:'🎉', price:40 }
      ],
      transactions: [
        { id:'t1', userId:'u2', type:'bonus', amount:500, label:'Welcome bonus', time:Date.now()-86400000 },
        { id:'t2', userId:'u2', type:'gift', amount:-50, label:'Star sent to Nusrat', time:Date.now()-5600000 },
        { id:'t3', userId:'u1', type:'earning', amount:35, label:'Gift earning', time:Date.now()-5600000 }
      ],
      notifications: [
        { id:'n1', userId:'u2', icon:'💜', title:'Maya followed you', text:'You have a new follower.', time:Date.now()-1800000, read:false },
        { id:'n2', userId:'u2', icon:'🎁', title:'Welcome bonus received', text:'500 demo coins were added to your wallet.', time:Date.now()-86000000, read:false },
        { id:'n3', userId:'u1', icon:'⭐', title:'You received a Star', text:'Arian sent a gift in your room.', time:Date.now()-5600000, read:true }
      ],
      reports: [
        { id:'rp1', reporterId:'u5', targetId:'u6', reason:'Inappropriate room title', status:'open', time:Date.now()-4500000 }
      ]
    };
  }

  function loadJSON(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  }
  function persistDb() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
  function t(key) { return translations[settings.language]?.[key] ?? key; }
  function currentUser() { return db.users.find(u => u.id === currentUserId) || null; }
  function userById(id) { return db.users.find(u => u.id === id); }
  function roomById(id) { return db.rooms.find(r => r.id === id); }
  function formatCount(n) { return n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(n>=10000?0:1)}K` : String(n); }
  function esc(value='') { return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
  function initials(name='User') { return name.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
  function colorVars(user) { return `--avatar-a:${user?.colors?.[0] || '#5b3df5'};--avatar-b:${user?.colors?.[1] || '#ff8c61'}`; }
  function avatar(user, size='') {
    if (!user) return `<div class="avatar ${size}" style="--avatar-a:#74788a;--avatar-b:#4f5261">?</div>`;
    const content = user.avatar ? `<img src="${esc(user.avatar)}" alt="${esc(user.name)}">` : esc(initials(user.name));
    return `<div class="avatar ${size}" style="${colorVars(user)}">${content}</div>`;
  }
  function roleLabel(role) { return role === 'admin' ? t('adminRole') : role === 'host' ? t('host') : t('guest'); }
  function timeAgo(time) {
    const s = Math.max(1, Math.floor((Date.now()-time)/1000));
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s/60)}m`;
    if (s < 86400) return `${Math.floor(s/3600)}h`;
    return `${Math.floor(s/86400)}d`;
  }
  function toast(message, type='') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function brandWave() {
    return `<svg class="brand-wave" viewBox="0 0 64 48" fill="none" aria-hidden="true">
      <rect x="4" y="17" width="6" height="15" rx="3" fill="currentColor" opacity=".7"/>
      <rect x="15" y="9" width="6" height="31" rx="3" fill="currentColor" opacity=".86"/>
      <rect x="26" y="2" width="6" height="44" rx="3" fill="currentColor"/>
      <rect x="37" y="9" width="6" height="31" rx="3" fill="currentColor" opacity=".86"/>
      <rect x="48" y="17" width="6" height="15" rx="3" fill="currentColor" opacity=".7"/>
    </svg>`;
  }

  function render() {
    clearInterval(speakingTimer);
    speakingTimer = null;
    if (state.splash) return renderSplash();
    if (!currentUser()) return renderAuth();
    if (state.roomId) return renderRoom();
    renderMain();
  }

  function renderSplash() {
    app.innerHTML = `<div class="splash">
      <div class="splash-card">
        <div class="brand-mark">${brandWave()}</div>
        <h1>Voxa</h1>
        <p>Voice. Community. Connection.</p>
        <div class="loader-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`;
    setTimeout(() => { state.splash = false; render(); }, 900);
  }

  function renderAuth() {
    const isLogin = state.authMode === 'login';
    app.innerHTML = `<main class="app-shell auth-screen">
      <section class="auth-hero">
        <div class="auth-brand"><span class="mini-logo">${brandWave()}</span> Voxa</div>
        <div>
          <h1>${settings.language === 'bn' ? 'কথা বলুন। বন্ধু খুঁজুন। নিজের কমিউনিটি গড়ুন।' : 'Talk. Connect. Build your community.'}</h1>
          <p>${t('loginSubtitle')}</p>
        </div>
      </section>
      <section class="auth-card">
        <div class="segmented">
          <button data-action="auth-mode" data-mode="login" class="${isLogin?'active':''}">${t('login')}</button>
          <button data-action="auth-mode" data-mode="register" class="${!isLogin?'active':''}">${t('register')}</button>
        </div>
        <form id="auth-form">
          ${!isLogin ? `
            <div class="field"><label>${t('name')}</label><input name="name" autocomplete="name" required placeholder="Alex Rahman"></div>
            <div class="field"><label>${t('username')}</label><input name="username" required placeholder="alex.voice"></div>` : ''}
          <div class="field"><label>${t('email')}</label><input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div>
          <div class="field"><label>${t('password')}</label><input name="password" type="password" autocomplete="${isLogin?'current-password':'new-password'}" minlength="6" required placeholder="••••••••"></div>
          <button class="primary-btn full" type="submit">${isLogin?t('login'):t('register')}</button>
        </form>
        <div class="demo-logins">
          <p>${t('guestLogin')}</p>
          <div class="demo-grid">
            <button data-action="demo-login" data-user="u2">${t('guest')}</button>
            <button data-action="demo-login" data-user="u1">${t('host')}</button>
            <button data-action="demo-login" data-user="admin">${t('adminRole')}</button>
          </div>
        </div>
        <div class="flex gap-8 mt-16">
          <button class="ghost-btn full" data-action="toggle-language">${settings.language === 'bn' ? 'English' : 'বাংলা'}</button>
          <button class="ghost-btn full" data-action="toggle-theme">${settings.theme === 'light' ? 'Dark' : 'Light'}</button>
        </div>
        <p class="auth-note">${t('demoNotice')}</p>
      </section>
    </main>`;
  }

  function renderMain() {
    const user = currentUser();
    app.innerHTML = `<div class="app-shell">${renderView()}${bottomNav()}</div>`;
    if (state.view === 'notifications') markNotificationsRead(user.id);
  }

  function renderView() {
    if (state.view === 'discover') return discoverView();
    if (state.view === 'notifications') return notificationsView();
    if (state.view === 'profile') return profileView();
    if (state.view === 'leaderboard') return leaderboardView();
    if (state.view === 'admin') return adminView();
    return homeView();
  }

  function topbar(title, subtitle='', actions=true) {
    const unread = db.notifications.filter(n => n.userId === currentUserId && !n.read).length;
    return `<header class="topbar">
      <div class="topbar-title"><small>${esc(subtitle)}</small><h1>${esc(title)}</h1></div>
      ${actions ? `<div class="top-actions">
        <button class="icon-btn" data-action="toggle-theme" aria-label="Toggle theme">${settings.theme==='light'?'☾':'☀'}</button>
        <button class="icon-btn" data-nav="notifications" aria-label="Notifications">♢${unread?`<span class="badge">${unread}</span>`:''}</button>
      </div>`:''}
    </header>`;
  }

  function homeView() {
    const user = currentUser();
    const onlineUsers = db.users.filter(u => u.online && u.id !== 'admin');
    const hosts = db.users.filter(u => u.role === 'host').sort((a,b)=>b.followers-a.followers).slice(0,3);
    const categories = ['All','Music','Lifestyle','Tech','Gaming','Community','Education'];
    const filteredRooms = state.category === 'All' ? db.rooms : db.rooms.filter(r=>r.category===state.category);
    return `<main class="screen">
      ${topbar(`${t('welcome')}, ${user.name.split(' ')[0]}`, settings.language==='bn'?'আজ কোন রুমে যোগ দেবেন?':'Which room will you join today?')}
      <section class="balance-card">
        <div><div class="balance-label">${t('coins')}</div><div class="balance-value">${user.coins.toLocaleString()}</div><div class="balance-sub">${t('demoBalance')} · ${t('earnings')} ৳${user.earnings.toLocaleString()}</div></div>
        <div class="coin-orb">◈</div>
      </section>
      <section class="section">
        <div class="section-head"><h2>${t('onlineNow')}</h2><button data-nav="discover">${t('seeAll')}</button></div>
        <div class="online-strip">${onlineUsers.map(u=>`<button class="online-person" data-action="view-user" data-user="${u.id}" style="border:0;background:transparent;color:inherit;padding:0">
          <span class="avatar-wrap">${avatar(u)}<i class="online-dot"></i></span><span>${esc(u.name.split(' ')[0])}</span>
        </button>`).join('')}</div>
      </section>
      <section class="section">
        <div class="section-head"><h2>${t('popularRooms')}</h2><button data-nav="discover">${t('seeAll')}</button></div>
        <div class="category-row">${categories.map(c=>`<button class="category-chip ${state.category===c?'active':''}" data-action="category" data-category="${c}">${c}</button>`).join('')}</div>
        <div class="room-grid mt-16">${filteredRooms.slice(0,6).map(roomCard).join('')}</div>
      </section>
      <section class="section">
        <div class="section-head"><h2>${t('topHosts')}</h2><button data-nav="leaderboard">${t('seeAll')}</button></div>
        ${hosts.map(hostCard).join('')}
      </section>
    </main>`;
  }

  function roomCard(room) {
    const host = userById(room.hostId);
    const seatUsers = room.seats.filter(Boolean).slice(0,3).map(userById).filter(Boolean);
    const title = settings.language === 'en' && room.titleEn ? room.titleEn : room.title;
    return `<button class="room-card room-${room.theme}" data-action="join-room" data-room="${room.id}">
      <span class="live-pill"><i></i> LIVE · ${room.category}</span>
      <span>
        <h3>${room.locked?'🔒 ':''}${esc(title)}</h3>
        <span class="room-meta"><span>${esc(host?.name || 'Host')}</span><span>${room.listeners} ${t('online')}</span></span>
        <span class="room-meta mt-12"><span class="mini-stack">${seatUsers.map(u=>avatar(u,'xs')).join('')}</span><span>→</span></span>
      </span>
    </button>`;
  }

  function hostCard(host) {
    const me = currentUser();
    const isFollowing = me.following.includes(host.id);
    return `<div class="host-card">
      ${avatar(host,'sm')}
      <div class="host-info"><strong>${esc(host.name)}</strong><small>@${esc(host.username)} · ${formatCount(host.followers)} ${t('followers')}</small></div>
      ${host.id===me.id ? '<span class="role-pill">YOU</span>' : `<button class="follow-btn ${isFollowing?'following':''}" data-action="follow" data-user="${host.id}">${isFollowing?t('following'):t('follow')}</button>`}
    </div>`;
  }

  function discoverView() {
    const q = state.search.trim().toLowerCase();
    const rooms = db.rooms.filter(r => !q || r.title.toLowerCase().includes(q) || r.titleEn.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    const people = db.users.filter(u => u.id !== 'admin' && (!q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))).slice(0,6);
    return `<main class="screen">
      ${topbar(t('discover'), settings.language==='bn'?'রুম, বিষয় বা মানুষ খুঁজুন':'Find rooms, topics or people')}
      <div class="search-box"><input id="discover-search" value="${esc(state.search)}" placeholder="${t('search')}"><span>⌕</span></div>
      <section class="section mt-16"><div class="section-head"><h2>${t('rooms')}</h2><span class="small muted">${rooms.length}</span></div>
        ${rooms.length ? rooms.map(r=>{
          const host=userById(r.hostId); const title=settings.language==='en'?r.titleEn:r.title;
          return `<button class="list-card full" data-action="join-room" data-room="${r.id}" style="text-align:left;color:inherit">
            <span class="list-visual" style="--grad-a:${host.colors[0]};--grad-b:${host.colors[1]}">◖</span>
            <span class="list-main"><h3>${r.locked?'🔒 ':''}${esc(title)}</h3><p>${esc(r.description)}</p></span>
            <span class="list-side"><b>${r.listeners}</b><br>${t('online')}</span>
          </button>`;
        }).join('') : emptyState('⌕',t('noResults'),settings.language==='bn'?'অন্য শব্দ দিয়ে চেষ্টা করুন।':'Try another search term.')}
      </section>
      <section class="section"><div class="section-head"><h2>${settings.language==='bn'?'মানুষ':'People'}</h2><span class="small muted">${people.length}</span></div>${people.map(hostCard).join('')}</section>
    </main>`;
  }

  function notificationsView() {
    const notes = db.notifications.filter(n=>n.userId===currentUserId).sort((a,b)=>b.time-a.time);
    return `<main class="screen">
      ${topbar(t('notifications'), settings.language==='bn'?'সাম্প্রতিক আপডেট':'Recent activity')}
      ${notes.length ? notes.map(n=>`<article class="notification-card ${n.read?'':'unread'}"><div class="notification-icon">${n.icon}</div><div class="notification-text"><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p><time>${timeAgo(n.time)} ago</time></div></article>`).join('') : emptyState('♢',t('noResults'),settings.language==='bn'?'নতুন নোটিফিকেশন নেই।':'No new notifications.')}
    </main>`;
  }

  function profileView() {
    const user = currentUser();
    const myRooms = db.rooms.filter(r=>r.hostId===user.id).length;
    return `<main class="screen">
      ${topbar(t('profile'), `@${user.username}`)}
      <section class="profile-head">${avatar(user,'lg')}<h1>${esc(user.name)}</h1><p>${esc(user.bio)}</p><span class="role-pill">${roleLabel(user.role)}</span></section>
      <section class="stats-row"><div class="stat-box"><strong>${formatCount(user.followers)}</strong><span>${t('followers')}</span></div><div class="stat-box"><strong>${formatCount(user.following.length)}</strong><span>${t('following')}</span></div><div class="stat-box"><strong>${myRooms}</strong><span>${t('rooms')}</span></div></section>
      <section class="menu-list">
        <button class="menu-row" data-action="edit-profile"><span class="menu-icon">✎</span><strong>${t('editProfile')}</strong><small>›</small></button>
        <button class="menu-row" data-action="wallet"><span class="menu-icon">◈</span><strong>${t('wallet')}</strong><small>${user.coins.toLocaleString()} ›</small></button>
        <button class="menu-row" data-nav="leaderboard"><span class="menu-icon">♛</span><strong>${t('leaderboard')}</strong><small>›</small></button>
        <button class="menu-row" data-action="toggle-language"><span class="menu-icon">文</span><strong>${t('language')}</strong><small>${settings.language==='bn'?'বাংলা':'English'} ›</small></button>
        <button class="menu-row" data-action="toggle-theme"><span class="menu-icon">◐</span><strong>${t('appearance')}</strong><small>${settings.theme} ›</small></button>
        <button class="menu-row" data-action="install"><span class="menu-icon">⇩</span><strong>${t('install')}</strong><small>›</small></button>
        ${user.role==='admin'?`<button class="menu-row" data-nav="admin"><span class="menu-icon">⚙</span><strong>${t('admin')}</strong><small>›</small></button>`:''}
        <button class="menu-row" data-action="logout"><span class="menu-icon">↪</span><strong>${t('logout')}</strong><small>›</small></button>
      </section>
      <p class="auth-note">${t('demoNotice')}</p>
    </main>`;
  }

  function leaderboardView() {
    const users = db.users.filter(u=>u.id!=='admin').sort((a,b)=>{
      const mult = state.leaderboardPeriod==='weekly' ? .15 : state.leaderboardPeriod==='monthly' ? .55 : 1;
      return (b.earnings*mult+b.followers/20) - (a.earnings*mult+a.followers/20);
    });
    const top = users.slice(0,3);
    const rest = users.slice(3);
    const podiumOrder = [top[1],top[0],top[2]];
    return `<main class="screen">
      ${topbar(t('leaderboard'), settings.language==='bn'?'কমিউনিটির সেরা ক্রিয়েটর':'Top community creators')}
      <div class="leader-tabs"><button data-action="leader-period" data-period="weekly" class="${state.leaderboardPeriod==='weekly'?'active':''}">${t('weekly')}</button><button data-action="leader-period" data-period="monthly" class="${state.leaderboardPeriod==='monthly'?'active':''}">${t('monthly')}</button><button data-action="leader-period" data-period="all" class="${state.leaderboardPeriod==='all'?'active':''}">${t('allTime')}</button></div>
      <section class="podium">${podiumOrder.map((u,index)=>u?`<div class="podium-item ${u.id===top[0].id?'first':''}">${avatar(u,u.id===top[0].id?'lg':'')}<strong>${esc(u.name.split(' ')[0])}</strong><small>${u.id===top[0].id?'🥇':index===0?'🥈':'🥉'} ${formatCount(u.earnings)} pts</small></div>`:'').join('')}</section>
      ${rest.map((u,i)=>`<div class="rank-row"><div class="rank-number">${i+4}</div>${avatar(u,'sm')}<div class="rank-main"><strong>${esc(u.name)}</strong><small>@${esc(u.username)}</small></div><div class="rank-score">${formatCount(u.earnings)} pts</div></div>`).join('')}
    </main>`;
  }

  function adminView() {
    const user = currentUser();
    if (user.role !== 'admin') { state.view='home'; return homeView(); }
    const activeUsers = db.users.filter(u=>u.status==='active').length;
    return `<main class="screen">
      ${topbar(t('admin'), settings.language==='bn'?'Demo management console':'Demo management console', false)}
      <section class="admin-banner"><h2>Voxa Control Center</h2><p>Manage demo users, rooms, reports and platform activity. Changes are stored in this browser.</p></section>
      <section class="admin-metrics"><div class="metric-card"><small>Total users</small><strong>${db.users.length}</strong><span>+3 this week</span></div><div class="metric-card"><small>Active users</small><strong>${activeUsers}</strong><span>${db.users.filter(u=>u.online).length} online</span></div><div class="metric-card"><small>Live rooms</small><strong>${db.rooms.length}</strong><span>${db.rooms.filter(r=>r.locked).length} locked</span></div><div class="metric-card"><small>Open reports</small><strong>${db.reports.filter(r=>r.status==='open').length}</strong><span>Needs review</span></div></section>
      <div class="section-head"><h2>Users</h2><button data-action="reset-demo">Reset demo</button></div>
      <div class="table-wrap"><table class="admin-table"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Coins</th><th>Action</th></tr></thead><tbody>${db.users.map(u=>`<tr><td><b>${esc(u.name)}</b><br><span class="muted">@${esc(u.username)}</span></td><td>${u.role}</td><td><span class="status ${u.status}">${u.status}</span></td><td>${u.coins}</td><td>${u.id==='admin'?'—':`<button class="tiny-btn" data-action="admin-toggle-user" data-user="${u.id}">${u.status==='active'?'Block':'Activate'}</button>`}</td></tr>`).join('')}</tbody></table></div>
      <div class="section-head mt-20"><h2>Reports</h2><span class="small muted">${db.reports.length}</span></div>
      ${db.reports.map(r=>{ const target=userById(r.targetId); return `<div class="list-card"><div class="list-visual" style="--grad-a:#e84b62;--grad-b:#ff9472">!</div><div class="list-main"><h3>${esc(r.reason)}</h3><p>Target: ${esc(target?.name||'Unknown')} · ${timeAgo(r.time)} ago</p></div><button class="tiny-btn" data-action="resolve-report" data-report="${r.id}">${r.status==='open'?'Resolve':'Done'}</button></div>`; }).join('') || emptyState('✓','No reports','All clear.')}
    </main>`;
  }

  function bottomNav() {
    const items = [
      ['home','⌂',t('home')],['discover','⌕',t('discover')],['create','＋',t('create')],['notifications','♢',t('notifications')],['profile','○',t('profile')]
    ];
    return `<nav class="bottom-nav">${items.map(([id,icon,label])=> id==='create' ? `<button class="nav-item" data-action="create-room"><span class="nav-create">${icon}</span><span>${label}</span></button>` : `<button class="nav-item ${state.view===id?'active':''}" data-nav="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('')}</nav>`;
  }

  function renderRoom() {
    const room = roomById(state.roomId);
    const me = currentUser();
    if (!room) { state.roomId=null; return render(); }
    const host = userById(room.hostId);
    const title = settings.language==='en'?room.titleEn:room.title;
    const messages = db.messages[room.id] || [];
    const isFollowing = me.following.includes(host.id);
    const occupied = room.seats.filter(Boolean).length;
    app.innerHTML = `<div class="app-shell room-screen">
      <header class="room-top"><div class="room-top-left"><button class="room-back" data-action="leave-room">‹</button><div class="room-title-wrap"><h1>${room.locked?'🔒 ':''}${esc(title)}</h1><p>${room.listeners} ${t('member')} · ${room.category}</p></div></div><button class="room-more" data-action="room-menu">•••</button></header>
      <section class="room-host-banner">${avatar(host,'sm')}<div class="host-info"><strong>${esc(host.name)}</strong><small>@${esc(host.username)} · ${formatCount(host.followers)} ${t('followers')}</small></div>${host.id!==me.id?`<button class="follow-btn ${isFollowing?'following':''}" data-action="follow" data-user="${host.id}">${isFollowing?t('following'):t('follow')}</button>`:'<span class="role-pill">HOST</span>'}</section>
      <section class="seat-grid">${room.seats.map((uid,i)=>{
        const u=uid?userById(uid):null;
        return `<button class="seat" data-action="seat" data-index="${i}" style="border:0;background:transparent;color:#fff;padding:0"><span class="seat-avatar ${u?'filled':''}" style="${u?colorVars(u):''}">${u?(u.avatar?`<img src="${esc(u.avatar)}" alt="">`:esc(initials(u.name))):'＋'}${u?`<i class="mic-status">${i%3===1?'×':'⌁'}</i>`:''}</span><span>${u?esc(u.name.split(' ')[0]):settings.language==='bn'?'খালি সিট':'Empty'}</span></button>`;
      }).join('')}</section>
      <section class="room-panel"><div class="room-panel-tabs"><button class="${state.roomPanel==='chat'?'active':''}" data-action="room-tab" data-tab="chat">${t('chat')}</button><button class="${state.roomPanel==='audience'?'active':''}" data-action="room-tab" data-tab="audience">${t('audience')} (${Math.max(0,room.listeners-occupied)})</button></div>
        ${state.roomPanel==='chat' ? `<div class="chat-list" id="chat-list">${messages.map(m=>m.userId==='system'?`<div class="chat-line system">${esc(m.text)}</div>`:`<div class="chat-line"><b>${esc(userById(m.userId)?.name || 'Guest')}:</b>${esc(m.text)}</div>`).join('')}</div><form class="chat-compose" id="chat-form"><input name="message" maxlength="180" placeholder="${t('message')}" autocomplete="off"><button type="submit">➤</button></form>` : audienceList(room)}
      </section>
      <nav class="room-controls"><button class="room-control" data-action="gift"><i>🎁</i>${t('sendGift')}</button><button class="room-control primary" data-action="mic"><i>${state.micOn?'⌁':'♩'}</i>${state.micOn?t('micOn'):t('requestMic')}</button><button class="room-control" data-action="share-room"><i>↗</i>Share</button><button class="room-control danger" data-action="leave-room"><i>×</i>${t('leave')}</button></nav>
    </div>`;
    setTimeout(()=>{ const list=document.getElementById('chat-list'); if(list) list.scrollTop=list.scrollHeight; },0);
    speakingTimer = setInterval(simulateSpeaker, 2200);
  }

  function audienceList(room) {
    const audience = db.users.filter(u=>u.id!=='admin' && !room.seats.includes(u.id));
    return `<div>${audience.map(u=>`<div class="host-card" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.1);box-shadow:none">${avatar(u,'sm')}<div class="host-info"><strong>${esc(u.name)}</strong><small style="color:rgba(255,255,255,.55)">@${esc(u.username)}</small></div><span style="font-size:10px;opacity:.6">${u.online?t('online'):''}</span></div>`).join('')}</div>`;
  }

  function simulateSpeaker() {
    const nodes = [...document.querySelectorAll('.seat-avatar.filled')];
    nodes.forEach(n=>n.classList.remove('speaking'));
    if (nodes.length) nodes[Math.floor(Math.random()*nodes.length)].classList.add('speaking');
  }

  function emptyState(icon,title,text) { return `<div class="empty-state"><div class="empty-icon">${icon}</div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`; }

  function openModal(content) {
    modalRoot.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" onclick="event.stopPropagation()">${content}</section></div>`;
  }
  function closeModal() { modalRoot.innerHTML=''; }
  function modalHead(title) { return `<div class="modal-head"><h2>${esc(title)}</h2><button class="modal-close" data-action="close-modal">×</button></div>`; }

  function openCreateRoom() {
    openModal(`${modalHead(t('createRoom'))}<form id="create-room-form"><div class="field"><label>${t('roomTitle')}</label><input name="title" maxlength="48" required placeholder="${settings.language==='bn'?'আপনার রুমের নাম':'Your room title'}"></div><div class="field"><label>${t('category')}</label><select name="category"><option>Music</option><option>Lifestyle</option><option>Tech</option><option>Gaming</option><option>Community</option><option>Education</option></select></div><div class="field"><label>${t('description')}</label><textarea name="description" maxlength="140" placeholder="${settings.language==='bn'?'রুমটি কী বিষয়ে?':'What is this room about?'}"></textarea></div><div class="modal-actions"><button type="button" class="secondary-btn" data-action="close-modal">${t('cancel')}</button><button class="primary-btn" type="submit">${t('createRoom')}</button></div></form>`);
  }

  function openGiftModal() {
    const me=currentUser();
    openModal(`${modalHead(t('sendGift'))}<div class="flex justify-between items-center"><span class="muted small">${t('coins')}</span><strong>◈ ${me.coins.toLocaleString()}</strong></div><div class="gift-grid mt-16">${db.gifts.map(g=>`<button class="gift-item" data-action="send-gift" data-gift="${g.id}"><span class="gift-emoji">${g.emoji}</span><strong>${g.name}</strong><small>◈ ${g.price}</small></button>`).join('')}</div>`);
  }

  function openWallet() {
    const me=currentUser();
    const tx=db.transactions.filter(x=>x.userId===me.id).sort((a,b)=>b.time-a.time);
    openModal(`${modalHead(t('wallet'))}<div class="balance-card"><div><div class="balance-label">${t('coins')}</div><div class="balance-value">${me.coins.toLocaleString()}</div><div class="balance-sub">${t('earnings')} ৳${me.earnings.toLocaleString()}</div></div><div class="coin-orb">◈</div></div><button class="primary-btn full mt-16" data-action="add-demo-coins">+ 500 demo coins</button><div class="section-head mt-20"><h2>History</h2></div>${tx.length?tx.map(x=>`<div class="rank-row"><div class="notification-icon">${x.amount>0?'＋':'−'}</div><div class="rank-main"><strong>${esc(x.label)}</strong><small>${timeAgo(x.time)} ago</small></div><div class="rank-score" style="color:${x.amount>0?'var(--success)':'var(--danger)'}">${x.amount>0?'+':''}${x.amount}</div></div>`).join(''):emptyState('◈','No transactions','Your demo transaction history will appear here.')}`);
  }

  function openEditProfile() {
    const me=currentUser();
    openModal(`${modalHead(t('editProfile'))}<form id="profile-form"><div style="display:flex;justify-content:center;margin-bottom:16px">${avatar(me,'lg')}</div><div class="field"><label>${t('name')}</label><input name="name" value="${esc(me.name)}" required></div><div class="field"><label>${t('username')}</label><input name="username" value="${esc(me.username)}" required></div><div class="field"><label>Bio</label><textarea name="bio" maxlength="120">${esc(me.bio)}</textarea></div><div class="field"><label>Profile photo (optional)</label><input name="avatar" type="file" accept="image/*"></div><button class="primary-btn full" type="submit">${t('save')}</button></form>`);
  }

  function openUser(userId) {
    const u=userById(userId); if(!u)return;
    const me=currentUser(); const isFollowing=me.following.includes(u.id);
    openModal(`${modalHead(u.name)}<div class="profile-head">${avatar(u,'lg')}<h1>${esc(u.name)}</h1><p>@${esc(u.username)}</p><span class="role-pill">${roleLabel(u.role)}</span></div><p class="muted small" style="text-align:center;line-height:1.6">${esc(u.bio)}</p><div class="stats-row"><div class="stat-box"><strong>${formatCount(u.followers)}</strong><span>${t('followers')}</span></div><div class="stat-box"><strong>${u.following.length}</strong><span>${t('following')}</span></div><div class="stat-box"><strong>${db.rooms.filter(r=>r.hostId===u.id).length}</strong><span>${t('rooms')}</span></div></div>${u.id!==me.id?`<div class="modal-actions"><button class="secondary-btn" data-action="report-user" data-user="${u.id}">${t('report')}</button><button class="primary-btn" data-action="follow" data-user="${u.id}">${isFollowing?t('following'):t('follow')}</button></div>`:''}`);
  }

  function openRoomMenu() {
    const room=roomById(state.roomId); const me=currentUser(); const isHost=room.hostId===me.id || me.role==='admin';
    openModal(`${modalHead('Room options')}<div class="menu-list"><button class="menu-row" data-action="share-room"><span class="menu-icon">↗</span><strong>Share room</strong><small>›</small></button>${isHost?`<button class="menu-row" data-action="toggle-room-lock"><span class="menu-icon">${room.locked?'🔓':'🔒'}</span><strong>${room.locked?'Unlock room':'Lock room'}</strong><small>›</small></button>`:''}<button class="menu-row" data-action="report-user" data-user="${room.hostId}"><span class="menu-icon">!</span><strong>${t('report')}</strong><small>›</small></button></div>`);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form=event.target;
    if(form.id==='auth-form') return submitAuth(new FormData(form));
    if(form.id==='create-room-form') return submitCreateRoom(new FormData(form));
    if(form.id==='chat-form') return submitChat(new FormData(form),form);
    if(form.id==='profile-form') return submitProfile(new FormData(form));
  }

  function submitAuth(data) {
    const email=String(data.get('email')||'').trim().toLowerCase();
    const password=String(data.get('password')||'');
    if(state.authMode==='login') {
      const user=db.users.find(u=>u.email.toLowerCase()===email && u.password===password);
      if(!user) return toast(settings.language==='bn'?'ইমেইল বা পাসওয়ার্ড সঠিক নয়':'Incorrect email or password','error');
      if(user.status==='blocked') return toast('This account is blocked.','error');
      loginAs(user.id); return;
    }
    const name=String(data.get('name')||'').trim();
    const username=String(data.get('username')||'').trim().replace(/\s+/g,'.');
    if(db.users.some(u=>u.email.toLowerCase()===email)) return toast('Email already registered.','error');
    const user={id:`u${Date.now()}`,name,username,email,password,role:'user',coins:500,earnings:0,followers:0,following:[],bio:'New to Voxa community.',avatar:'',colors:['#5b3df5','#ff8c61'],status:'active',online:true};
    db.users.push(user); db.notifications.push({id:`n${Date.now()}`,userId:user.id,icon:'🎁',title:'Welcome to Voxa',text:'500 demo coins were added to your account.',time:Date.now(),read:false});
    db.transactions.push({id:`t${Date.now()}`,userId:user.id,type:'bonus',amount:500,label:'Welcome bonus',time:Date.now()}); persistDb(); loginAs(user.id);
  }

  function loginAs(id) { currentUserId=id; localStorage.setItem(SESSION_KEY,id); state.view='home'; render(); toast(`${t('welcome')}!`,'success'); }

  function submitCreateRoom(data) {
    const title=String(data.get('title')||'').trim(); const category=String(data.get('category')||'Community'); const description=String(data.get('description')||'').trim();
    const me=currentUser(); if(me.role==='user') me.role='host';
    const room={id:`r${Date.now()}`,title,title,titleEn:title,category,description:description||'A new community room.',hostId:me.id,listeners:1,locked:false,theme:(db.rooms.length%6)+1,seats:[me.id,null,null,null,null,null,null,null],createdAt:Date.now()};
    db.rooms.unshift(room); db.messages[room.id]=[{id:`m${Date.now()}`,userId:'system',text:`${me.name} opened the room.`,time:Date.now()}]; persistDb(); closeModal(); state.roomId=room.id; render(); toast(t('roomCreated'),'success');
  }

  function submitChat(data,form) {
    const text=String(data.get('message')||'').trim(); if(!text)return;
    const room=roomById(state.roomId); if(!db.messages[room.id])db.messages[room.id]=[];
    db.messages[room.id].push({id:`m${Date.now()}`,userId:currentUserId,text,time:Date.now()}); persistDb(); form.reset(); renderRoom();
  }

  async function submitProfile(data) {
    const me=currentUser(); me.name=String(data.get('name')||me.name).trim(); me.username=String(data.get('username')||me.username).trim(); me.bio=String(data.get('bio')||'').trim();
    const file=data.get('avatar');
    if(file && file.size) {
      if(file.size>900000) return toast('Please choose an image smaller than 900 KB.','error');
      me.avatar=await fileToDataUrl(file);
    }
    persistDb(); closeModal(); render(); toast(t('profileSaved'),'success');
  }

  function fileToDataUrl(file) { return new Promise((resolve,reject)=>{ const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(file); }); }

  function handleClick(event) {
    const el=event.target.closest('[data-action],[data-nav]'); if(!el)return;
    const nav=el.dataset.nav; if(nav){ state.view=nav; state.roomId=null; render(); return; }
    const action=el.dataset.action;
    if(action==='auth-mode'){state.authMode=el.dataset.mode;render();}
    else if(action==='demo-login') loginAs(el.dataset.user);
    else if(action==='toggle-language') toggleLanguage();
    else if(action==='toggle-theme') toggleTheme();
    else if(action==='category'){state.category=el.dataset.category;render();}
    else if(action==='join-room') joinRoom(el.dataset.room);
    else if(action==='leave-room'){state.roomId=null;state.micOn=false;render();}
    else if(action==='create-room') openCreateRoom();
    else if(action==='close-modal') closeModal();
    else if(action==='follow') toggleFollow(el.dataset.user);
    else if(action==='view-user') openUser(el.dataset.user);
    else if(action==='edit-profile') openEditProfile();
    else if(action==='wallet') openWallet();
    else if(action==='logout') logout();
    else if(action==='gift') openGiftModal();
    else if(action==='send-gift') sendGift(el.dataset.gift);
    else if(action==='room-tab'){state.roomPanel=el.dataset.tab;renderRoom();}
    else if(action==='mic') toggleMic();
    else if(action==='seat') takeSeat(Number(el.dataset.index));
    else if(action==='room-menu') openRoomMenu();
    else if(action==='share-room') shareRoom();
    else if(action==='toggle-room-lock') toggleRoomLock();
    else if(action==='leader-period'){state.leaderboardPeriod=el.dataset.period;render();}
    else if(action==='add-demo-coins') addDemoCoins();
    else if(action==='report-user') reportUser(el.dataset.user);
    else if(action==='admin-toggle-user') adminToggleUser(el.dataset.user);
    else if(action==='resolve-report') resolveReport(el.dataset.report);
    else if(action==='reset-demo') resetDemo();
    else if(action==='install') installApp();
  }

  function handleInput(event) {
    if(event.target.id==='discover-search') { state.search=event.target.value; window.clearTimeout(handleInput.timer); handleInput.timer=setTimeout(render,180); }
  }

  function joinRoom(id) {
    const room=roomById(id); if(!room)return;
    if(room.locked && currentUser().role==='user' && room.hostId!==currentUserId) toast(settings.language==='bn'?'লকড রুমে demo হিসেবে প্রবেশ করানো হলো':'Entering locked room in demo mode');
    room.listeners += 1; state.roomId=id; state.roomPanel='chat'; persistDb(); render();
  }

  function toggleFollow(id) {
    const me=currentUser(); if(id===me.id)return;
    const target=userById(id); const idx=me.following.indexOf(id);
    if(idx>=0){me.following.splice(idx,1);target.followers=Math.max(0,target.followers-1);}else{me.following.push(id);target.followers+=1;db.notifications.push({id:`n${Date.now()}`,userId:id,icon:'💜',title:`${me.name} followed you`,text:'You have a new follower.',time:Date.now(),read:false});}
    persistDb(); if(modalRoot.innerHTML) openUser(id); else render();
  }

  function toggleLanguage() { settings.language=settings.language==='bn'?'en':'bn'; localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));document.documentElement.lang=settings.language;closeModal();render(); }
  function toggleTheme() { settings.theme=settings.theme==='light'?'dark':'light'; localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));document.documentElement.dataset.theme=settings.theme;render();toast(t('themeChanged')); }
  function logout() { localStorage.removeItem(SESSION_KEY);currentUserId=null;state.view='home';closeModal();render(); }

  function sendGift(giftId) {
    const gift=db.gifts.find(g=>g.id===giftId); const me=currentUser(); const room=roomById(state.roomId); const host=userById(room.hostId);
    if(me.coins<gift.price)return toast(t('notEnoughCoins'),'error');
    me.coins-=gift.price; host.earnings+=Math.round(gift.price*.7);
    const now=Date.now(); db.transactions.push({id:`t${now}`,userId:me.id,type:'gift',amount:-gift.price,label:`${gift.name} sent to ${host.name}`,time:now}); db.transactions.push({id:`t${now+1}`,userId:host.id,type:'earning',amount:Math.round(gift.price*.7),label:`${gift.name} received from ${me.name}`,time:now}); db.notifications.push({id:`n${now}`,userId:host.id,icon:gift.emoji,title:`You received ${gift.name}`,text:`${me.name} sent a gift in your room.`,time:now,read:false});
    db.messages[room.id].push({id:`m${now}`,userId:'system',text:`${me.name} sent ${gift.emoji} ${gift.name} to ${host.name}.`,time:now}); persistDb(); closeModal(); renderRoom();
    const anim=document.createElement('div');anim.className='gift-animation';anim.textContent=gift.emoji;document.body.appendChild(anim);setTimeout(()=>anim.remove(),1600);toast(t('giftSent'),'success');
  }

  function toggleMic() {
    const room=roomById(state.roomId); const seatIndex=room.seats.indexOf(currentUserId);
    if(seatIndex<0){const empty=room.seats.indexOf(null);if(empty>=0){room.seats[empty]=currentUserId;db.messages[room.id].push({id:`m${Date.now()}`,userId:'system',text:`${currentUser().name} joined a speaker seat.`,time:Date.now()});toast(t('micRequested'),'success');}else return toast('No speaker seat is available.','error');}
    state.micOn=!state.micOn; persistDb(); renderRoom(); toast(state.micOn?t('micOn'):t('micOff'));
  }

  function takeSeat(index) {
    const room=roomById(state.roomId); const currentIndex=room.seats.indexOf(currentUserId);
    if(room.seats[index] && room.seats[index]!==currentUserId) return openUser(room.seats[index]);
    if(currentIndex>=0) room.seats[currentIndex]=null;
    room.seats[index]=currentUserId; state.micOn=true; persistDb(); renderRoom(); toast(t('micOn'),'success');
  }

  async function shareRoom() {
    const room=roomById(state.roomId); const url=`${location.origin}${location.pathname}#room=${room.id}`;
    try { if(navigator.share) await navigator.share({title:room.title,text:room.description,url}); else await navigator.clipboard.writeText(url); toast(t('copied'),'success'); } catch {}
    closeModal();
  }

  function toggleRoomLock() { const room=roomById(state.roomId);room.locked=!room.locked;persistDb();closeModal();renderRoom();toast(room.locked?t('roomLocked'):t('roomUnlocked'),'success'); }
  function addDemoCoins(){const me=currentUser();me.coins+=500;db.transactions.push({id:`t${Date.now()}`,userId:me.id,type:'bonus',amount:500,label:'Demo coin refill',time:Date.now()});persistDb();openWallet();toast('+500 coins','success');}

  function reportUser(userId) {
    const target=userById(userId); if(!target)return;
    const reason=window.prompt(settings.language==='bn'?'রিপোর্টের সংক্ষিপ্ত কারণ লিখুন:':'Write a short reason for the report:');
    if(!reason)return; db.reports.push({id:`rp${Date.now()}`,reporterId:currentUserId,targetId:userId,reason:reason.trim(),status:'open',time:Date.now()});persistDb();closeModal();toast('Report submitted.','success');
  }

  function adminToggleUser(userId){if(currentUser().role!=='admin')return;const u=userById(userId);u.status=u.status==='active'?'blocked':'active';persistDb();render();}
  function resolveReport(id){if(currentUser().role!=='admin')return;const r=db.reports.find(x=>x.id===id);if(r)r.status='resolved';persistDb();render();}
  function resetDemo(){if(!confirm('Reset all demo data in this browser?'))return;db=seedDatabase();persistDb();currentUserId='admin';localStorage.setItem(SESSION_KEY,'admin');render();toast('Demo reset complete.','success');}
  function markNotificationsRead(userId){let changed=false;db.notifications.forEach(n=>{if(n.userId===userId&&!n.read){n.read=true;changed=true;}});if(changed)persistDb();}


  /* =========================
     VOXA 2.0 FEATURE UPGRADE
     ========================= */

  Object.assign(state, {
    discoverMode: 'trending',
    adminTab: 'overview',
    walletTab: 'balance',
    replyTo: null,
    giftCategory: 'All',
    activeProfileTab: 'about',
    remoteTyping: '',
    roomFilter: 'All'
  });

  const syncChannel = window.__voxaSyncChannel = ('BroadcastChannel' in window ? new BroadcastChannel('voxa-v2-sync') : null);
  const recentMessageTimes = [];

  function persistDb() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    if (window.__voxaSyncChannel) window.__voxaSyncChannel.postMessage({ type: 'db-sync', at: Date.now() });
    if (window.VoxaBackend?.configured()) window.VoxaBackend.save(db).catch(()=>{});
  }

  function upgradeDatabase() {
    db.appVersion = 2;
    db.categories ||= ['Music','Lifestyle','Tech','Gaming','Community','Education','Business','Wellness'];
    db.badges ||= [
      {id:'b1',name:'Early Member',icon:'🌱',description:'Joined during the demo launch'},
      {id:'b2',name:'Popular Host',icon:'🎙️',description:'Hosted an active community room'},
      {id:'b3',name:'Top Supporter',icon:'💜',description:'Sent gifts to creators'},
      {id:'b4',name:'Safe Community',icon:'🛡️',description:'Helped keep rooms respectful'},
      {id:'b5',name:'7 Day Streak',icon:'🔥',description:'Checked in seven days'}
    ];
    db.announcements ||= [
      {id:'a1',title:'Welcome to Voxa 2.0',text:'Explore upgraded rooms, missions, gifts, safety tools and creator features.',active:true,time:Date.now()-3600000}
    ];
    db.withdrawals ||= [
      {id:'w1',userId:'u1',amount:1200,method:'bKash •••• 5125',status:'pending',time:Date.now()-7200000}
    ];
    db.activities ||= [{id:'ac1',actorId:'admin',action:'Demo database upgraded to Voxa 2.0',time:Date.now()-1800000}];
    db.promoCodes ||= [
      {code:'VOXA500',coins:500,uses:20,active:true},
      {code:'WELCOME',coins:250,uses:100,active:true}
    ];
    db.tasks ||= [
      {id:'task-checkin',title:'Daily check-in',description:'Open Voxa today',target:1,reward:50,type:'checkin'},
      {id:'task-room',title:'Join 2 rooms',description:'Explore two community rooms',target:2,reward:80,type:'room'},
      {id:'task-chat',title:'Send 3 messages',description:'Participate respectfully in room chat',target:3,reward:100,type:'chat'},
      {id:'task-follow',title:'Follow a creator',description:'Support a host you enjoy',target:1,reward:60,type:'follow'}
    ];
    db.taskProgress ||= {};
    db.roomInvites ||= [];
    db.moderation ||= { bannedWords:['spamlink','scamoffer','abuseword'], maxMessagesPer10Seconds:5 };

    const countryDefaults = ['Bangladesh','Bangladesh','Bangladesh','Bangladesh','Bangladesh','Bangladesh','Global'];
    db.users.forEach((u,index) => {
      u.country ||= countryDefaults[index] || 'Bangladesh';
      u.language ||= index % 2 ? 'English, বাংলা' : 'বাংলা, English';
      u.age ||= 20 + (index % 9);
      u.interests ||= index % 3 === 0 ? ['Music','Community'] : index % 3 === 1 ? ['Tech','Gaming'] : ['Lifestyle','Education'];
      u.badges ||= u.role === 'host' ? ['b1','b2'] : ['b1'];
      if (u.id === 'u2' && !u.badges.includes('b3')) u.badges.push('b3');
      u.level ||= Math.max(1, Math.floor((u.followers + u.earnings) / 3500) + 1);
      u.xp ||= Math.min(999, 120 + index * 115);
      u.streak ||= index % 3 + 1;
      u.lastCheckIn ||= 0;
      u.completedTasks ||= [];
      u.claimedTasks ||= [];
      u.blockedUsers ||= [];
      u.favoriteRooms ||= [];
      u.recentRooms ||= [];
      u.verified = u.verified ?? (u.role === 'host' && index < 4);
      u.premium = u.premium ?? (index === 0 || index === 2);
      u.profileViews ||= 120 + index * 39;
      u.joinedAt ||= Date.now() - (index + 2) * 86400000 * 30;
    });

    db.rooms.forEach((r,index) => {
      r.visibility ||= index === 4 ? 'private' : 'public';
      r.password ||= r.visibility === 'private' ? '1234' : '';
      r.scheduledAt ||= null;
      r.maxAudience ||= 250;
      r.featured = r.featured ?? (index < 2);
      r.ended = r.ended ?? false;
      r.moderators ||= index === 0 ? ['u3'] : [];
      r.coHosts ||= index === 0 ? ['u4'] : [];
      r.seatLocks ||= Array(8).fill(false);
      r.seatReserved ||= Array(8).fill('');
      r.micRequests ||= [];
      r.pinnedMessageId ||= null;
      r.joinedUsers ||= r.seats.filter(Boolean);
      r.recentVisitors ||= [];
    });

    if (!db.rooms.some(r=>r.id==='r-scheduled-1')) {
      db.rooms.push({id:'r-scheduled-1',title:'ফ্রিল্যান্সিং ক্যারিয়ার Q&A',titleEn:'Freelancing Career Q&A',category:'Business',description:'A scheduled session about starting small and finding realistic online work.',hostId:'u2',listeners:0,locked:false,theme:3,seats:['u2',null,null,null,null,null,null,null],createdAt:Date.now(),visibility:'public',password:'',scheduledAt:Date.now()+86400000,maxAudience:300,featured:true,ended:false,moderators:[],coHosts:[],seatLocks:Array(8).fill(false),seatReserved:Array(8).fill(''),micRequests:[],pinnedMessageId:null,joinedUsers:[],recentVisitors:[]});
      db.messages['r-scheduled-1'] = [];
    }
    if (!db.rooms.some(r=>r.id==='r-scheduled-2')) {
      db.rooms.push({id:'r-scheduled-2',title:'English Practice — Beginners',titleEn:'English Practice — Beginners',category:'Education',description:'Friendly beginner practice with short speaking prompts.',hostId:'u4',listeners:0,locked:false,theme:6,seats:['u4',null,null,null,null,null,null,null],createdAt:Date.now(),visibility:'public',password:'',scheduledAt:Date.now()+172800000,maxAudience:180,featured:false,ended:false,moderators:[],coHosts:[],seatLocks:Array(8).fill(false),seatReserved:Array(8).fill(''),micRequests:[],pinnedMessageId:null,joinedUsers:[],recentVisitors:[]});
      db.messages['r-scheduled-2'] = [];
    }

    Object.values(db.messages).flat().forEach(m => {
      m.reactions ||= {};
      m.replyTo ||= null;
      m.image ||= '';
      m.deleted ||= false;
    });

    const giftCategories = ['Classic','Classic','Premium','Premium','Luxury','Luxury','Love','Party'];
    db.gifts.forEach((g,index)=>{ g.category ||= giftCategories[index] || 'Classic'; g.active = g.active ?? true; });
    if (!db.gifts.some(g=>g.id==='g9')) db.gifts.push({id:'g9',name:'Universe',emoji:'🪐',price:900,category:'Luxury',active:true});
    if (!db.gifts.some(g=>g.id==='g10')) db.gifts.push({id:'g10',name:'Fireworks',emoji:'🎆',price:180,category:'Party',active:true});
  }

  function logActivity(action, actorId=currentUserId || 'system') {
    db.activities.unshift({id:`ac${Date.now()}${Math.random()}`,actorId,action,time:Date.now()});
    db.activities = db.activities.slice(0,80);
  }

  function backendMode() {
    return window.VOXA_CONFIG?.backend === 'supabase' && window.VOXA_CONFIG?.supabaseUrl && window.VOXA_CONFIG?.supabaseAnonKey ? 'Supabase configured' : 'Local demo mode';
  }

  function todayKey() { return new Date().toISOString().slice(0,10); }
  function taskKey(userId, taskId) { return `${userId}:${todayKey()}:${taskId}`; }
  function progressTask(type, amount=1) {
    const me=currentUser(); if(!me) return;
    db.tasks.filter(task=>task.type===type).forEach(task=>{
      const key=taskKey(me.id,task.id);
      db.taskProgress[key]=Math.min(task.target,(db.taskProgress[key]||0)+amount);
    });
  }
  function taskProgress(task) { return db.taskProgress[taskKey(currentUserId,task.id)] || 0; }
  function isTaskClaimed(task) { return currentUser().claimedTasks.includes(`${todayKey()}:${task.id}`); }
  function addXp(amount) {
    const me=currentUser(); me.xp += amount;
    while(me.xp >= 1000){ me.xp -= 1000; me.level += 1; toast(`Level up! You reached level ${me.level}.`,'success'); }
  }
  function notify(userId, icon, title, text) {
    db.notifications.push({id:`n${Date.now()}${Math.random()}`,userId,icon,title,text,time:Date.now(),read:false});
  }
  function isHostOrMod(room, userId=currentUserId) {
    const u=userById(userId); return room.hostId===userId || room.moderators.includes(userId) || u?.role==='admin';
  }
  function formatDateTime(value) {
    if(!value) return '';
    return new Intl.DateTimeFormat(settings.language==='bn'?'bn-BD':'en-US',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
  }
  function verifiedMark(user) { return user?.verified ? '<span class="verified-mark" title="Verified">✓</span>' : ''; }
  function premiumMark(user) { return user?.premium ? '<span class="premium-mark" title="Premium">PRO</span>' : ''; }
  function badgeItems(user,limit=5) {
    return (user.badges||[]).slice(0,limit).map(id=>db.badges.find(b=>b.id===id)).filter(Boolean).map(b=>`<span class="achievement-chip" title="${esc(b.description)}">${b.icon} ${esc(b.name)}</span>`).join('');
  }

  function renderView() {
    if (state.view === 'discover') return discoverView();
    if (state.view === 'notifications') return notificationsView();
    if (state.view === 'profile') return profileView();
    if (state.view === 'leaderboard') return leaderboardView();
    if (state.view === 'tasks') return tasksView();
    if (state.view === 'safety') return safetyView();
    if (state.view === 'admin') return adminView();
    return homeView();
  }

  function topbar(title, subtitle='', actions=true) {
    const unread = db.notifications.filter(n => n.userId === currentUserId && !n.read).length;
    return `<header class="topbar v2-topbar">
      <div class="topbar-title"><small>${esc(subtitle)}</small><h1>${esc(title)}</h1></div>
      ${actions ? `<div class="top-actions">
        <span class="backend-dot" title="${esc(backendMode())}"></span>
        <button class="icon-btn" data-action="toggle-theme" aria-label="Toggle theme">${settings.theme==='light'?'☾':'☀'}</button>
        <button class="icon-btn" data-nav="notifications" aria-label="Notifications">♢${unread?`<span class="badge">${unread}</span>`:''}</button>
      </div>`:''}
    </header>`;
  }

  function announcementBanner() {
    const a=db.announcements.find(x=>x.active&&!(x.dismissedBy||[]).includes(currentUserId));
    if(!a) return '';
    return `<section class="announcement-banner"><span>📣</span><div><strong>${esc(a.title)}</strong><p>${esc(a.text)}</p></div><button data-action="dismiss-announcement" data-id="${a.id}">×</button></section>`;
  }

  function homeView() {
    const user=currentUser();
    const onlineUsers=db.users.filter(u=>u.online&&u.id!=='admin'&&!user.blockedUsers.includes(u.id));
    const liveRooms=db.rooms.filter(r=>!r.ended&&!r.scheduledAt);
    const featured=liveRooms.filter(r=>r.featured).slice(0,4);
    const followingLive=liveRooms.filter(r=>user.following.includes(r.hostId)).slice(0,4);
    const scheduled=db.rooms.filter(r=>r.scheduledAt && r.scheduledAt>Date.now()).sort((a,b)=>a.scheduledAt-b.scheduledAt).slice(0,3);
    const checked=user.lastCheckIn===todayKey();
    const completed=db.tasks.filter(t=>taskProgress(t)>=t.target).length;
    return `<main class="screen">
      ${topbar(`${t('welcome')}, ${user.name.split(' ')[0]}`,settings.language==='bn'?'আজ আপনার কমিউনিটিতে কী হচ্ছে':'What is happening in your community')}
      ${announcementBanner()}
      <section class="hero-dashboard">
        <div><span class="eyebrow">LEVEL ${user.level}</span><h2>${settings.language==='bn'?'কথা বলুন, সংযুক্ত থাকুন':'Talk, connect and grow'}</h2><p>${user.streak} day streak · ${user.xp}/1000 XP</p><div class="xp-track"><i style="width:${Math.min(100,user.xp/10)}%"></i></div></div>
        <button class="checkin-orb ${checked?'checked':''}" data-action="daily-checkin">${checked?'✓':'＋'}<small>${checked?'Checked':'Check in'}</small></button>
      </section>
      <section class="quick-grid">
        <button data-action="wallet"><span>◈</span><strong>${user.coins.toLocaleString()}</strong><small>Coins</small></button>
        <button data-nav="tasks"><span>✓</span><strong>${completed}/${db.tasks.length}</strong><small>Missions</small></button>
        <button data-nav="leaderboard"><span>♛</span><strong>#${Math.max(1,db.users.filter(u=>u.id!=='admin').sort((a,b)=>b.earnings-a.earnings).findIndex(u=>u.id===user.id)+1)}</strong><small>Rank</small></button>
        <button data-action="create-room"><span>🎙</span><strong>Start</strong><small>New room</small></button>
      </section>
      <section class="section"><div class="section-head"><h2>${t('onlineNow')}</h2><button data-nav="discover">${t('seeAll')}</button></div><div class="online-strip">${onlineUsers.map(u=>`<button class="online-person" data-action="view-user" data-user="${u.id}" style="border:0;background:transparent;color:inherit;padding:0"><span class="avatar-wrap">${avatar(u)}<i class="online-dot"></i></span><span>${esc(u.name.split(' ')[0])}</span></button>`).join('')}</div></section>
      <section class="section"><div class="section-head"><h2>Featured live rooms</h2><button data-nav="discover">${t('seeAll')}</button></div><div class="room-grid mt-16">${(featured.length?featured:liveRooms.slice(0,4)).map(roomCard).join('')}</div></section>
      ${followingLive.length?`<section class="section"><div class="section-head"><h2>Hosts you follow</h2></div><div class="room-grid mt-16">${followingLive.map(roomCard).join('')}</div></section>`:''}
      <section class="section"><div class="section-head"><h2>Upcoming rooms</h2><button data-nav="discover">See schedule</button></div><div class="schedule-list">${scheduled.map(scheduledRoomCard).join('')}</div></section>
    </main>`;
  }

  function roomCard(room) {
    const host=userById(room.hostId); const me=currentUser(); const favorite=me.favoriteRooms.includes(room.id);
    const title=settings.language==='en'&&room.titleEn?room.titleEn:room.title;
    const seatUsers=room.seats.filter(Boolean).slice(0,3).map(userById).filter(Boolean);
    return `<article class="room-card-v2 room-${room.theme}">
      <div class="room-card-actions"><span class="live-pill"><i></i> LIVE · ${esc(room.category)}</span><button data-action="favorite-room" data-room="${room.id}" aria-label="Favorite">${favorite?'★':'☆'}</button></div>
      <button class="room-card-body" data-action="join-room" data-room="${room.id}"><h3>${room.locked?'🔒 ':''}${esc(title)}</h3><p>${esc(room.description)}</p><span class="room-host-line">${avatar(host,'xs')} ${esc(host?.name||'Host')} ${verifiedMark(host)}</span><span class="room-card-bottom"><span class="mini-stack">${seatUsers.map(u=>avatar(u,'xs')).join('')}</span><b>${room.listeners} online →</b></span></button>
    </article>`;
  }

  function scheduledRoomCard(room) {
    const host=userById(room.hostId); const joined=db.roomInvites.some(i=>i.roomId===room.id&&i.userId===currentUserId&&i.type==='reminder');
    return `<article class="scheduled-card"><div class="schedule-date"><strong>${new Date(room.scheduledAt).getDate()}</strong><small>${new Date(room.scheduledAt).toLocaleString('en',{month:'short'})}</small></div><div><h3>${esc(settings.language==='en'?room.titleEn:room.title)}</h3><p>${formatDateTime(room.scheduledAt)} · ${esc(host.name)}</p></div><button class="tiny-btn ${joined?'done':''}" data-action="room-reminder" data-room="${room.id}">${joined?'✓ Set':'Remind me'}</button></article>`;
  }

  function discoverView() {
    const q=state.search.trim().toLowerCase(); const me=currentUser();
    let rooms=db.rooms.filter(r=>!r.ended);
    if(state.discoverMode==='trending') rooms=rooms.sort((a,b)=>b.listeners-a.listeners);
    if(state.discoverMode==='following') rooms=rooms.filter(r=>me.following.includes(r.hostId));
    if(state.discoverMode==='scheduled') rooms=rooms.filter(r=>r.scheduledAt).sort((a,b)=>a.scheduledAt-b.scheduledAt);
    if(state.roomFilter!=='All') rooms=rooms.filter(r=>r.category===state.roomFilter);
    rooms=rooms.filter(r=>!q||(r.title||'').toLowerCase().includes(q)||(r.titleEn||'').toLowerCase().includes(q)||(r.category||'').toLowerCase().includes(q)||(r.description||'').toLowerCase().includes(q));
    const people=db.users.filter(u=>u.id!=='admin'&&!me.blockedUsers.includes(u.id)&&(!q||u.name.toLowerCase().includes(q)||u.username.toLowerCase().includes(q)||u.interests.join(' ').toLowerCase().includes(q))).slice(0,8);
    return `<main class="screen">${topbar(t('discover'),'Rooms, topics, creators and scheduled events')}
      <div class="search-box"><input id="discover-search" value="${esc(state.search)}" placeholder="${t('search')}"><span>⌕</span></div>
      <div class="leader-tabs discover-tabs"><button data-action="discover-mode" data-mode="trending" class="${state.discoverMode==='trending'?'active':''}">Trending</button><button data-action="discover-mode" data-mode="following" class="${state.discoverMode==='following'?'active':''}">Following</button><button data-action="discover-mode" data-mode="scheduled" class="${state.discoverMode==='scheduled'?'active':''}">Scheduled</button></div>
      <div class="category-row mt-16">${['All',...db.categories].map(c=>`<button class="category-chip ${state.roomFilter===c?'active':''}" data-action="room-filter" data-category="${c}">${esc(c)}</button>`).join('')}</div>
      <section class="section mt-16"><div class="section-head"><h2>${t('rooms')}</h2><span class="small muted">${rooms.length}</span></div>${rooms.length?`<div class="room-grid">${rooms.map(r=>r.scheduledAt?scheduledRoomCard(r):roomCard(r)).join('')}</div>`:emptyState('⌕',t('noResults'),'Try another filter or search term.')}</section>
      <section class="section"><div class="section-head"><h2>People</h2><span class="small muted">${people.length}</span></div>${people.map(hostCard).join('')}</section>
    </main>`;
  }

  function hostCard(host) {
    const me=currentUser(); const isFollowing=me.following.includes(host.id);
    return `<div class="host-card">${avatar(host,'sm')}<div class="host-info"><strong>${esc(host.name)} ${verifiedMark(host)} ${premiumMark(host)}</strong><small>@${esc(host.username)} · L${host.level} · ${formatCount(host.followers)} ${t('followers')}</small></div>${host.id===me.id?'<span class="role-pill">YOU</span>':`<button class="follow-btn ${isFollowing?'following':''}" data-action="follow" data-user="${host.id}">${isFollowing?t('following'):t('follow')}</button>`}</div>`;
  }

  function notificationsView() {
    const notes=db.notifications.filter(n=>n.userId===currentUserId).sort((a,b)=>b.time-a.time);
    return `<main class="screen">${topbar(t('notifications'),'Invites, gifts, follows and platform updates')}
      <div class="section-head"><h2>Activity</h2><div><button class="tiny-btn" data-action="mark-all-read">Read all</button> <button class="tiny-btn" data-action="clear-notifications">Clear</button></div></div>
      ${notes.length?notes.map(n=>`<article class="notification-card ${n.read?'':'unread'}"><div class="notification-icon">${n.icon}</div><div class="notification-text"><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p><time>${timeAgo(n.time)} ago</time></div></article>`).join(''):emptyState('♢',t('noResults'),'No notifications yet.')}
    </main>`;
  }

  function profileView() {
    const user=currentUser(); const myRooms=db.rooms.filter(r=>r.hostId===user.id).length;
    return `<main class="screen">${topbar(t('profile'),`@${user.username}`)}
      <section class="profile-cover"><div class="profile-gradient"></div>${avatar(user,'lg')}<h1>${esc(user.name)} ${verifiedMark(user)} ${premiumMark(user)}</h1><p>${esc(user.bio)}</p><div class="profile-tags"><span>${roleLabel(user.role)}</span><span>Level ${user.level}</span><span>🔥 ${user.streak} days</span></div></section>
      <section class="xp-card"><div><strong>${user.xp}/1000 XP</strong><small>Level ${user.level+1} progress</small></div><div class="xp-track"><i style="width:${Math.min(100,user.xp/10)}%"></i></div></section>
      <section class="stats-row"><button class="stat-box" data-action="show-followers"><strong>${formatCount(user.followers)}</strong><span>${t('followers')}</span></button><button class="stat-box" data-action="show-following"><strong>${formatCount(user.following.length)}</strong><span>${t('following')}</span></button><div class="stat-box"><strong>${myRooms}</strong><span>${t('rooms')}</span></div><div class="stat-box"><strong>${user.profileViews}</strong><span>Views</span></div></section>
      <section class="badge-showcase"><div class="section-head"><h2>Achievements</h2><button data-action="show-badges">See all</button></div><div class="achievement-row">${badgeItems(user)}</div></section>
      <section class="menu-list">
        <button class="menu-row" data-action="edit-profile"><span class="menu-icon">✎</span><strong>${t('editProfile')}</strong><small>›</small></button>
        <button class="menu-row" data-nav="tasks"><span class="menu-icon">✓</span><strong>Daily missions & rewards</strong><small>›</small></button>
        <button class="menu-row" data-action="wallet"><span class="menu-icon">◈</span><strong>${t('wallet')}</strong><small>${user.coins.toLocaleString()} ›</small></button>
        <button class="menu-row" data-nav="leaderboard"><span class="menu-icon">♛</span><strong>${t('leaderboard')}</strong><small>›</small></button>
        <button class="menu-row" data-nav="safety"><span class="menu-icon">🛡</span><strong>Safety & blocked users</strong><small>›</small></button>
        <button class="menu-row" data-action="toggle-language"><span class="menu-icon">文</span><strong>${t('language')}</strong><small>${settings.language==='bn'?'বাংলা':'English'} ›</small></button>
        <button class="menu-row" data-action="toggle-theme"><span class="menu-icon">◐</span><strong>${t('appearance')}</strong><small>${settings.theme} ›</small></button>
        <button class="menu-row" data-action="install"><span class="menu-icon">⇩</span><strong>${t('install')}</strong><small>›</small></button>
        ${user.role==='admin'?`<button class="menu-row" data-nav="admin"><span class="menu-icon">⚙</span><strong>${t('admin')}</strong><small>›</small></button>`:''}
        <button class="menu-row" data-action="logout"><span class="menu-icon">↪</span><strong>${t('logout')}</strong><small>›</small></button>
      </section>
      <div class="mode-card"><b>Backend status</b><span>${esc(backendMode())}</span><small>${backendMode()==='Local demo mode'?'Data is stored in this browser. Supabase setup files are included.':'Shared backend configuration detected.'}</small></div>
    </main>`;
  }

  function tasksView() {
    const me=currentUser(); const checked=me.lastCheckIn===todayKey();
    return `<main class="screen">${topbar('Missions & rewards',`${me.streak} day streak · Level ${me.level}`)}
      <section class="streak-card"><div><span>🔥</span><h2>${me.streak} day streak</h2><p>Check in and complete missions to earn demo coins and XP.</p></div><button class="primary-btn" data-action="daily-checkin" ${checked?'disabled':''}>${checked?'Checked in':'Check in +50'}</button></section>
      <section class="section"><div class="section-head"><h2>Today’s missions</h2><span>${db.tasks.filter(t=>isTaskClaimed(t)).length}/${db.tasks.length} claimed</span></div>${db.tasks.map(task=>{const p=taskProgress(task);const done=p>=task.target;const claimed=isTaskClaimed(task);return `<article class="task-card"><div class="task-icon">${task.type==='checkin'?'📅':task.type==='room'?'🚪':task.type==='chat'?'💬':'💜'}</div><div class="task-main"><strong>${esc(task.title)}</strong><p>${esc(task.description)}</p><div class="task-progress"><i style="width:${Math.min(100,p/task.target*100)}%"></i></div><small>${p}/${task.target} · Reward ◈${task.reward}</small></div><button class="tiny-btn ${claimed?'done':''}" data-action="claim-task" data-task="${task.id}" ${!done||claimed?'disabled':''}>${claimed?'Claimed':'Claim'}</button></article>`;}).join('')}</section>
    </main>`;
  }

  function safetyView() {
    const me=currentUser(); const blocked=me.blockedUsers.map(userById).filter(Boolean);
    return `<main class="screen">${topbar('Safety center','Privacy, moderation and community controls')}
      <section class="safety-hero"><span>🛡️</span><h2>Respectful community first</h2><p>Report harmful behaviour, block users and review the demo community rules.</p></section>
      <section class="menu-list"><button class="menu-row" data-action="show-guidelines"><span class="menu-icon">📘</span><strong>Community guidelines</strong><small>›</small></button><button class="menu-row" data-action="show-privacy"><span class="menu-icon">🔐</span><strong>Privacy summary</strong><small>›</small></button></section>
      <section class="section"><div class="section-head"><h2>Blocked users</h2><span>${blocked.length}</span></div>${blocked.length?blocked.map(u=>`<div class="host-card">${avatar(u,'sm')}<div class="host-info"><strong>${esc(u.name)}</strong><small>@${esc(u.username)}</small></div><button class="tiny-btn" data-action="unblock-user" data-user="${u.id}">Unblock</button></div>`).join(''):emptyState('✓','No blocked users','Users you block will appear here.')}</section>
    </main>`;
  }

  function leaderboardView() {
    const multiplier=state.leaderboardPeriod==='weekly'?.2:state.leaderboardPeriod==='monthly'?.6:1;
    const users=db.users.filter(u=>u.id!=='admin').sort((a,b)=>(b.earnings*multiplier+b.followers/10+b.xp)-(a.earnings*multiplier+a.followers/10+a.xp));
    const top=users.slice(0,3); const rest=users.slice(3); const order=[top[1],top[0],top[2]];
    return `<main class="screen">${topbar(t('leaderboard'),'Top hosts, supporters and community creators')}
      <div class="leader-tabs"><button data-action="leader-period" data-period="weekly" class="${state.leaderboardPeriod==='weekly'?'active':''}">${t('weekly')}</button><button data-action="leader-period" data-period="monthly" class="${state.leaderboardPeriod==='monthly'?'active':''}">${t('monthly')}</button><button data-action="leader-period" data-period="all" class="${state.leaderboardPeriod==='all'?'active':''}">${t('allTime')}</button></div>
      <section class="podium">${order.map((u,index)=>u?`<button class="podium-item ${u.id===top[0].id?'first':''}" data-action="view-user" data-user="${u.id}">${avatar(u,u.id===top[0].id?'lg':'')}<strong>${esc(u.name.split(' ')[0])} ${verifiedMark(u)}</strong><small>${u.id===top[0].id?'🥇':index===0?'🥈':'🥉'} ${formatCount(Math.round(u.earnings*multiplier+u.xp))} pts</small></button>`:'').join('')}</section>
      ${rest.map((u,i)=>`<button class="rank-row" data-action="view-user" data-user="${u.id}"><div class="rank-number">${i+4}</div>${avatar(u,'sm')}<div class="rank-main"><strong>${esc(u.name)} ${verifiedMark(u)}</strong><small>@${esc(u.username)} · Level ${u.level}</small></div><div class="rank-score">${formatCount(Math.round(u.earnings*multiplier+u.xp))}</div></button>`).join('')}
    </main>`;
  }

  function renderRoom() {
    const room=roomById(state.roomId); const me=currentUser(); if(!room){state.roomId=null;return render();}
    const host=userById(room.hostId); const title=settings.language==='en'?room.titleEn:room.title; const messages=db.messages[room.id]||[]; const occupied=room.seats.filter(Boolean).length; const canManage=isHostOrMod(room);
    const pinned=room.pinnedMessageId?messages.find(m=>m.id===room.pinnedMessageId):null;
    app.innerHTML=`<div class="app-shell room-screen room-v2">
      <header class="room-top"><div class="room-top-left"><button class="room-back" data-action="leave-room">‹</button><div class="room-title-wrap"><h1>${room.locked?'🔒 ':''}${esc(title)}</h1><p>${room.listeners}/${room.maxAudience} · ${room.category} · ${room.visibility}</p></div></div><button class="room-more" data-action="room-menu">•••</button></header>
      <section class="room-host-banner">${avatar(host,'sm')}<div class="host-info"><strong>${esc(host.name)} ${verifiedMark(host)} ${premiumMark(host)}</strong><small>@${esc(host.username)} · ${formatCount(host.followers)} followers</small></div>${host.id!==me.id?`<button class="follow-btn ${me.following.includes(host.id)?'following':''}" data-action="follow" data-user="${host.id}">${me.following.includes(host.id)?t('following'):t('follow')}</button>`:'<span class="role-pill">HOST</span>'}</section>
      ${pinned&&!pinned.deleted?`<button class="pinned-message" data-action="scroll-message" data-message="${pinned.id}"><span>📌</span><div><b>Pinned message</b><p>${esc(pinned.text||'Image')}</p></div></button>`:''}
      ${room.micRequests.length&&canManage?`<section class="request-strip"><b>Mic requests</b>${room.micRequests.map(uid=>{const u=userById(uid);return `<span>${avatar(u,'xs')} ${esc(u.name)} <button data-action="approve-mic" data-user="${uid}">✓</button><button data-action="reject-mic" data-user="${uid}">×</button></span>`;}).join('')}</section>`:''}
      <section class="seat-grid">${room.seats.map((uid,i)=>{const u=uid?userById(uid):null;const locked=room.seatLocks[i];const reserved=room.seatReserved[i];return `<div class="seat-wrap"><button class="seat" data-action="seat" data-index="${i}" style="border:0;background:transparent;color:#fff;padding:0"><span class="seat-avatar ${u?'filled':''} ${locked?'locked':''}" style="${u?colorVars(u):''}">${u?(u.avatar?`<img src="${esc(u.avatar)}" alt="">`:esc(initials(u.name))):locked?'🔒':reserved?'R':'＋'}${u?`<i class="mic-status">${u.id===currentUserId&&!state.micOn?'×':'⌁'}</i>`:''}</span><span>${u?esc(u.name.split(' ')[0]):reserved?esc(userById(reserved)?.name.split(' ')[0]||'Reserved'):locked?'Locked':'Empty'}</span></button>${canManage?`<button class="seat-admin" data-action="seat-options" data-index="${i}">⋮</button>`:''}</div>`;}).join('')}</section>
      <section class="room-panel"><div class="room-panel-tabs"><button class="${state.roomPanel==='chat'?'active':''}" data-action="room-tab" data-tab="chat">${t('chat')}</button><button class="${state.roomPanel==='audience'?'active':''}" data-action="room-tab" data-tab="audience">${t('audience')} (${Math.max(0,room.listeners-occupied)})</button></div>
        ${state.roomPanel==='chat'?chatPanel(room,messages,canManage):audienceListV2(room,canManage)}
      </section>
      <nav class="room-controls"><button class="room-control" data-action="gift"><i>🎁</i>${t('sendGift')}</button><button class="room-control" data-action="quick-reaction"><i>👏</i>React</button><button class="room-control primary ${state.micOn?'active':''}" data-action="mic"><i>${state.micOn?'🎙':'🎤'}</i>${room.seats.includes(me.id)?(state.micOn?t('micOn'):t('micOff')):t('requestMic')}</button><button class="room-control" data-action="leave-room"><i>↪</i>${t('leave')}</button></nav>
    </div>`;
    setTimeout(()=>{const c=document.getElementById('chat-list');if(c)c.scrollTop=c.scrollHeight;},0); simulateSpeaker();
  }

  function chatPanel(room,messages,canManage) {
    const reply=state.replyTo?messages.find(m=>m.id===state.replyTo):null;
    return `<div class="chat-list" id="chat-list">${messages.map(m=>messageBubble(room,m,canManage)).join('')}</div>
      ${state.remoteTyping?`<div class="typing-indicator">${esc(state.remoteTyping)} is typing…</div>`:''}
      ${reply?`<div class="reply-preview"><span>Replying to ${esc(userById(reply.userId)?.name||'message')}: ${esc((reply.text||'Image').slice(0,60))}</span><button data-action="cancel-reply">×</button></div>`:''}
      <form class="chat-compose v2-compose" id="chat-form"><label class="attach-btn">＋<input name="image" type="file" accept="image/*" hidden></label><input name="message" maxlength="300" placeholder="${t('message')}" autocomplete="off"><button type="submit">➤</button></form>`;
  }

  function messageBubble(room,m,canManage) {
    if(m.deleted) return `<div class="chat-message deleted" id="msg-${m.id}">Message removed by ${m.deletedBy==='self'?'sender':'moderator'}.</div>`;
    if(m.userId==='system') return `<div class="chat-line system" id="msg-${m.id}">${esc(m.text)}</div>`;
    const u=userById(m.userId); const reply=m.replyTo?(db.messages[room.id]||[]).find(x=>x.id===m.replyTo):null;
    const reactionCount=Object.values(m.reactions||{}).reduce((s,a)=>s+(a?.length||0),0);
    return `<article class="chat-message ${m.userId===currentUserId?'mine':''}" id="msg-${m.id}">${avatar(u,'xs')}<div class="message-content"><header><b>${esc(u?.name||'Guest')} ${verifiedMark(u)}</b><time>${timeAgo(m.time)}</time></header>${reply?`<div class="quoted-message">↪ ${esc((reply.text||'Image').slice(0,80))}</div>`:''}${m.image?`<img class="chat-image" src="${esc(m.image)}" alt="Shared image">`:''}${m.text?`<p>${esc(m.text)}</p>`:''}<div class="message-actions"><button data-action="reply-message" data-message="${m.id}">Reply</button><button data-action="react-message" data-message="${m.id}">❤ ${reactionCount||''}</button>${canManage?`<button data-action="pin-message" data-message="${m.id}">${room.pinnedMessageId===m.id?'Unpin':'Pin'}</button>`:''}${m.userId===currentUserId||canManage?`<button data-action="delete-message" data-message="${m.id}">Delete</button>`:''}</div>${reactionCount?`<div class="reaction-summary">${Object.entries(m.reactions).map(([e,ids])=>`${e} ${ids.length}`).join(' · ')}</div>`:''}</div></article>`;
  }

  function audienceListV2(room,canManage) {
    const members=[...new Set([...room.joinedUsers,...room.seats.filter(Boolean)])].map(userById).filter(Boolean);
    return `<div class="audience-list">${members.map(u=>`<div class="host-card">${avatar(u,'sm')}<div class="host-info"><strong>${esc(u.name)} ${verifiedMark(u)}</strong><small>${u.id===room.hostId?'Host':room.moderators.includes(u.id)?'Moderator':room.coHosts.includes(u.id)?'Co-host':'Audience'}</small></div>${canManage&&u.id!==room.hostId?`<button class="tiny-btn" data-action="audience-options" data-user="${u.id}">Manage</button>`:''}</div>`).join('')||emptyState('○','No audience','Invite people to join this room.')}</div>`;
  }

  function openCreateRoom() {
    openModal(`${modalHead(t('createRoom'))}<form id="create-room-form"><div class="field"><label>${t('roomTitle')}</label><input name="title" maxlength="70" required placeholder="Community hangout"></div><div class="form-grid"><div class="field"><label>${t('category')}</label><select name="category">${db.categories.map(c=>`<option>${esc(c)}</option>`).join('')}</select></div><div class="field"><label>Visibility</label><select name="visibility" id="room-visibility"><option value="public">Public</option><option value="private">Private</option><option value="followers">Followers only</option></select></div></div><div class="field"><label>${t('description')}</label><textarea name="description" maxlength="180" placeholder="What is this room about?"></textarea></div><div class="form-grid"><div class="field"><label>Schedule (optional)</label><input name="scheduledAt" type="datetime-local"></div><div class="field"><label>Maximum audience</label><input name="maxAudience" type="number" min="10" max="1000" value="250"></div></div><div class="field"><label>Private room password (optional)</label><input name="password" maxlength="20" placeholder="Leave blank for no password"></div><label class="switch-row"><input name="featuredRequest" type="checkbox"><span>Request featured placement</span></label><div class="modal-actions"><button type="button" class="secondary-btn" data-action="close-modal">${t('cancel')}</button><button class="primary-btn" type="submit">${t('createRoom')}</button></div></form>`);
  }

  function openGiftModal() {
    const me=currentUser(); const categories=['All',...new Set(db.gifts.filter(g=>g.active).map(g=>g.category))];
    openModal(`${modalHead(t('sendGift'))}<div class="flex justify-between items-center"><span class="muted small">${t('coins')}</span><strong>◈ ${me.coins.toLocaleString()}</strong></div><div class="category-row mt-16">${categories.map(c=>`<button class="category-chip ${state.giftCategory===c?'active':''}" data-action="gift-category" data-category="${c}">${esc(c)}</button>`).join('')}</div><div class="gift-grid mt-16">${db.gifts.filter(g=>g.active&&(state.giftCategory==='All'||g.category===state.giftCategory)).map(g=>`<div class="gift-item-wrap"><button class="gift-item" data-action="send-gift" data-gift="${g.id}" data-combo="1"><span class="gift-emoji">${g.emoji}</span><strong>${g.name}</strong><small>◈ ${g.price}</small></button><div class="gift-combos"><button data-action="send-gift" data-gift="${g.id}" data-combo="5">×5</button><button data-action="send-gift" data-gift="${g.id}" data-combo="10">×10</button></div></div>`).join('')}</div><p class="auth-note">Demo economy: creator receives 70%; platform commission is 30%.</p>`);
  }

  function openWallet(tab=state.walletTab) {
    state.walletTab=tab; const me=currentUser(); const tx=db.transactions.filter(x=>x.userId===me.id).sort((a,b)=>b.time-a.time); const withdrawals=db.withdrawals.filter(w=>w.userId===me.id).sort((a,b)=>b.time-a.time);
    const tabs=`<div class="leader-tabs"><button data-action="wallet-tab" data-tab="balance" class="${tab==='balance'?'active':''}">Balance</button><button data-action="wallet-tab" data-tab="history" class="${tab==='history'?'active':''}">History</button><button data-action="wallet-tab" data-tab="withdraw" class="${tab==='withdraw'?'active':''}">Withdraw</button></div>`;
    let content='';
    if(tab==='balance') content=`<div class="wallet-split"><div class="balance-card"><div><div class="balance-label">Coins</div><div class="balance-value">${me.coins.toLocaleString()}</div><div class="balance-sub">Used to send virtual gifts</div></div><div class="coin-orb">◈</div></div><div class="earning-card"><small>Creator earnings</small><strong>৳${me.earnings.toLocaleString()}</strong><span>Demo value only</span></div></div><div class="section-head mt-20"><h2>Demo recharge</h2></div><div class="recharge-grid">${[500,1200,2500,6000].map((n,i)=>`<button data-action="recharge" data-coins="${n}"><strong>◈ ${n.toLocaleString()}</strong><span>৳${[50,100,200,450][i]} demo</span></button>`).join('')}</div><form id="promo-form" class="promo-form"><input name="code" placeholder="Promo code"><button class="secondary-btn">Apply</button></form>`;
    if(tab==='history') content=tx.length?tx.map(x=>`<div class="rank-row"><div class="notification-icon">${x.amount>0?'＋':'−'}</div><div class="rank-main"><strong>${esc(x.label)}</strong><small>${timeAgo(x.time)} ago</small></div><div class="rank-score ${x.amount>0?'positive':'negative'}">${x.amount>0?'+':''}${x.amount}</div></div>`).join(''):emptyState('◈','No transactions','Your transaction history will appear here.');
    if(tab==='withdraw') content=`<div class="earning-card large"><small>Available demo earnings</small><strong>৳${me.earnings.toLocaleString()}</strong><span>Minimum withdrawal: ৳500</span></div><form id="withdraw-form"><div class="field"><label>Amount</label><input name="amount" type="number" min="500" max="${me.earnings}" required></div><div class="field"><label>Method</label><select name="method"><option>bKash</option><option>Nagad</option><option>Bank transfer</option></select></div><div class="field"><label>Account</label><input name="account" required placeholder="01XXXXXXXXX"></div><button class="primary-btn full">Submit demo request</button></form><div class="section-head mt-20"><h2>Requests</h2></div>${withdrawals.map(w=>`<div class="rank-row"><div class="notification-icon">৳</div><div class="rank-main"><strong>৳${w.amount} · ${esc(w.method)}</strong><small>${timeAgo(w.time)} ago</small></div><span class="status ${w.status}">${w.status}</span></div>`).join('')||'<p class="auth-note">No withdrawal requests.</p>'}`;
    openModal(`${modalHead(t('wallet'))}${tabs}<div class="mt-16">${content}</div>`);
  }

  function openEditProfile() {
    const me=currentUser();
    openModal(`${modalHead(t('editProfile'))}<form id="profile-form"><div style="display:flex;justify-content:center;margin-bottom:16px">${avatar(me,'lg')}</div><div class="field"><label>${t('name')}</label><input name="name" value="${esc(me.name)}" required></div><div class="field"><label>${t('username')}</label><input name="username" value="${esc(me.username)}" required></div><div class="field"><label>Bio</label><textarea name="bio" maxlength="160">${esc(me.bio)}</textarea></div><div class="form-grid"><div class="field"><label>Country</label><input name="country" value="${esc(me.country)}"></div><div class="field"><label>Age</label><input name="age" type="number" min="13" max="99" value="${me.age}"></div></div><div class="field"><label>Languages</label><input name="language" value="${esc(me.language)}"></div><div class="field"><label>Interests (comma separated)</label><input name="interests" value="${esc(me.interests.join(', '))}"></div><div class="field"><label>Profile photo (under 900 KB)</label><input name="avatar" type="file" accept="image/*"></div><button class="primary-btn full" type="submit">${t('save')}</button></form>`);
  }

  function openUser(userId) {
    const u=userById(userId); if(!u)return; const me=currentUser(); const isFollowing=me.following.includes(u.id); const blocked=me.blockedUsers.includes(u.id);
    u.profileViews=(u.profileViews||0)+1;
    openModal(`${modalHead(u.name)}<div class="profile-head">${avatar(u,'lg')}<h1>${esc(u.name)} ${verifiedMark(u)} ${premiumMark(u)}</h1><p>@${esc(u.username)} · Level ${u.level}</p><span class="role-pill">${roleLabel(u.role)}</span></div><p class="muted small centered-copy">${esc(u.bio)}</p><div class="achievement-row centered">${badgeItems(u,3)}</div><div class="stats-row"><div class="stat-box"><strong>${formatCount(u.followers)}</strong><span>${t('followers')}</span></div><div class="stat-box"><strong>${u.following.length}</strong><span>${t('following')}</span></div><div class="stat-box"><strong>${db.rooms.filter(r=>r.hostId===u.id).length}</strong><span>${t('rooms')}</span></div></div><div class="profile-details"><span>📍 ${esc(u.country)}</span><span>🗣 ${esc(u.language)}</span><span>✨ ${esc(u.interests.join(' · '))}</span></div>${u.id!==me.id?`<div class="modal-actions stacked"><button class="secondary-btn" data-action="report-target" data-target-type="user" data-target="${u.id}">${t('report')}</button><button class="secondary-btn" data-action="${blocked?'unblock-user':'block-user'}" data-user="${u.id}">${blocked?'Unblock':t('block')}</button><button class="primary-btn" data-action="follow" data-user="${u.id}">${isFollowing?t('following'):t('follow')}</button></div>`:''}`);
    persistDb();
  }

  function openRoomMenu() {
    const room=roomById(state.roomId); const me=currentUser(); const canManage=isHostOrMod(room); const isOwner=room.hostId===me.id||me.role==='admin';
    openModal(`${modalHead('Room options')}<div class="menu-list"><button class="menu-row" data-action="share-room"><span class="menu-icon">↗</span><strong>Share room</strong><small>›</small></button><button class="menu-row" data-action="favorite-room" data-room="${room.id}"><span class="menu-icon">☆</span><strong>${me.favoriteRooms.includes(room.id)?'Remove favorite':'Add to favorites'}</strong><small>›</small></button>${canManage?`<button class="menu-row" data-action="toggle-room-lock"><span class="menu-icon">${room.locked?'🔓':'🔒'}</span><strong>${room.locked?'Unlock room':'Lock room'}</strong><small>›</small></button><button class="menu-row" data-action="host-transfer"><span class="menu-icon">⇄</span><strong>Transfer host</strong><small>›</small></button>`:''}${isOwner?`<button class="menu-row danger-row" data-action="end-room"><span class="menu-icon">■</span><strong>End room</strong><small>›</small></button>`:''}<button class="menu-row" data-action="report-target" data-target-type="room" data-target="${room.id}"><span class="menu-icon">!</span><strong>${t('report')}</strong><small>›</small></button></div>`);
  }

  function openSeatOptions(index) {
    const room=roomById(state.roomId); if(!isHostOrMod(room))return; const uid=room.seats[index];
    openModal(`${modalHead(`Seat ${index+1}`)}<div class="menu-list"><button class="menu-row" data-action="toggle-seat-lock" data-index="${index}"><span class="menu-icon">🔒</span><strong>${room.seatLocks[index]?'Unlock seat':'Lock seat'}</strong><small>›</small></button>${uid&&uid!==room.hostId?`<button class="menu-row" data-action="remove-seat-user" data-index="${index}"><span class="menu-icon">↘</span><strong>Move ${esc(userById(uid)?.name||'user')} to audience</strong><small>›</small></button><button class="menu-row" data-action="toggle-moderator" data-user="${uid}"><span class="menu-icon">🛡</span><strong>${room.moderators.includes(uid)?'Remove moderator':'Make moderator'}</strong><small>›</small></button>`:''}<button class="menu-row" data-action="reserve-seat" data-index="${index}"><span class="menu-icon">R</span><strong>Reserve for a user</strong><small>›</small></button></div>`);
  }

  function openAudienceOptions(userId) {
    const room=roomById(state.roomId); if(!isHostOrMod(room))return; const u=userById(userId);
    openModal(`${modalHead(`Manage ${u.name}`)}<div class="menu-list"><button class="menu-row" data-action="invite-to-seat" data-user="${u.id}"><span class="menu-icon">🎙</span><strong>Invite to speaker seat</strong><small>›</small></button><button class="menu-row" data-action="toggle-moderator" data-user="${u.id}"><span class="menu-icon">🛡</span><strong>${room.moderators.includes(u.id)?'Remove moderator':'Make moderator'}</strong><small>›</small></button><button class="menu-row danger-row" data-action="kick-user" data-user="${u.id}"><span class="menu-icon">↪</span><strong>Remove from room</strong><small>›</small></button></div>`);
  }

  function adminView() {
    if(currentUser().role!=='admin'){state.view='home';return homeView();}
    const tabs=['overview','users','rooms','reports','economy','content'];
    let content='';
    if(state.adminTab==='overview') content=adminOverview();
    if(state.adminTab==='users') content=adminUsers();
    if(state.adminTab==='rooms') content=adminRooms();
    if(state.adminTab==='reports') content=adminReports();
    if(state.adminTab==='economy') content=adminEconomy();
    if(state.adminTab==='content') content=adminContent();
    return `<main class="screen admin-screen">${topbar(t('admin'),`Voxa Control Center · ${backendMode()}`,false)}<section class="admin-banner"><h2>Platform operations</h2><p>Manage users, rooms, reports, gifts, withdrawals, announcements and demo content.</p></section><div class="admin-tabs">${tabs.map(tab=>`<button data-action="admin-tab" data-tab="${tab}" class="${state.adminTab===tab?'active':''}">${tab}</button>`).join('')}</div>${content}</main>`;
  }

  function adminOverview() {
    const active=db.users.filter(u=>u.status==='active').length; const open=db.reports.filter(r=>r.status==='open').length; const txToday=db.transactions.filter(x=>Date.now()-x.time<86400000).length;
    const bars=[db.users.length,db.rooms.filter(r=>!r.ended).length,db.messages?Object.values(db.messages).flat().length:0,db.transactions.length]; const max=Math.max(...bars,1);
    return `<section class="admin-metrics"><div class="metric-card"><small>Total users</small><strong>${db.users.length}</strong><span>${active} active</span></div><div class="metric-card"><small>Live rooms</small><strong>${db.rooms.filter(r=>!r.ended&&!r.scheduledAt).length}</strong><span>${db.rooms.filter(r=>r.scheduledAt).length} scheduled</span></div><div class="metric-card"><small>Open reports</small><strong>${open}</strong><span>Needs review</span></div><div class="metric-card"><small>Transactions</small><strong>${db.transactions.length}</strong><span>${txToday} today</span></div></section><section class="chart-card"><h2>Platform activity snapshot</h2><div class="bar-chart">${[['Users',bars[0]],['Rooms',bars[1]],['Messages',bars[2]],['Transactions',bars[3]]].map(([label,n])=>`<div><i style="height:${Math.max(8,n/max*100)}%"></i><span>${label}<b>${n}</b></span></div>`).join('')}</div></section><section class="section"><div class="section-head"><h2>Recent admin activity</h2><button data-action="reset-demo">Reset demo</button></div>${db.activities.slice(0,8).map(a=>`<div class="activity-row"><span>•</span><div><strong>${esc(a.action)}</strong><small>${timeAgo(a.time)} ago</small></div></div>`).join('')}</section>`;
  }
  function adminUsers() { return `<div class="table-wrap"><table class="admin-table"><thead><tr><th>User</th><th>Role</th><th>Level</th><th>Status</th><th>Coins</th><th>Action</th></tr></thead><tbody>${db.users.map(u=>`<tr><td><b>${esc(u.name)} ${verifiedMark(u)}</b><br><span class="muted">@${esc(u.username)}</span></td><td>${u.role}</td><td>${u.level}</td><td><span class="status ${u.status}">${u.status}</span></td><td>${u.coins}</td><td>${u.id==='admin'?'—':`<button class="tiny-btn" data-action="admin-toggle-user" data-user="${u.id}">${u.status==='active'?'Block':'Activate'}</button> <button class="tiny-btn" data-action="admin-toggle-verify" data-user="${u.id}">${u.verified?'Unverify':'Verify'}</button>`}</td></tr>`).join('')}</tbody></table></div>`; }
  function adminRooms() { return `<div class="section-head"><h2>Rooms</h2><span>${db.rooms.length}</span></div>${db.rooms.map(r=>`<div class="list-card"><div class="list-visual" style="--grad-a:#5b3df5;--grad-b:#ff8c61">🎙</div><div class="list-main"><h3>${esc(r.title)} ${r.featured?'⭐':''}</h3><p>${esc(userById(r.hostId)?.name||'Unknown')} · ${r.listeners} users · ${r.ended?'Ended':r.scheduledAt?'Scheduled':'Live'}</p></div><div class="admin-inline-actions"><button class="tiny-btn" data-action="admin-feature-room" data-room="${r.id}">${r.featured?'Unfeature':'Feature'}</button><button class="tiny-btn" data-action="admin-close-room" data-room="${r.id}">${r.ended?'Reopen':'Close'}</button></div></div>`).join('')}`; }
  function adminReports() { return db.reports.map(r=>{const target=r.targetType==='room'?roomById(r.targetId):userById(r.targetId);return `<div class="list-card"><div class="list-visual" style="--grad-a:#e84b62;--grad-b:#ff9472">!</div><div class="list-main"><h3>${esc(r.reason)}</h3><p>${r.targetType||'user'}: ${esc(target?.name||target?.title||'Unknown')} · ${timeAgo(r.time)} ago</p></div><button class="tiny-btn" data-action="resolve-report" data-report="${r.id}" ${r.status==='resolved'?'disabled':''}>${r.status==='open'?'Resolve':'Done'}</button></div>`;}).join('')||emptyState('✓','No reports','All clear.'); }
  function adminEconomy() { const pending=db.withdrawals.filter(w=>w.status==='pending');return `<section class="admin-metrics"><div class="metric-card"><small>Total coin movement</small><strong>${db.transactions.reduce((s,t)=>s+Math.abs(t.amount),0).toLocaleString()}</strong><span>Demo coins</span></div><div class="metric-card"><small>Pending withdrawals</small><strong>${pending.length}</strong><span>৳${pending.reduce((s,w)=>s+w.amount,0)}</span></div></section><div class="section-head"><h2>Withdrawal requests</h2></div>${db.withdrawals.map(w=>`<div class="rank-row"><div class="notification-icon">৳</div><div class="rank-main"><strong>${esc(userById(w.userId)?.name||'User')} · ৳${w.amount}</strong><small>${esc(w.method)} · ${timeAgo(w.time)} ago</small></div><span class="status ${w.status}">${w.status}</span>${w.status==='pending'?`<button class="tiny-btn" data-action="admin-withdraw" data-id="${w.id}" data-status="approved">Approve</button><button class="tiny-btn" data-action="admin-withdraw" data-id="${w.id}" data-status="rejected">Reject</button>`:''}</div>`).join('')||emptyState('৳','No requests','No withdrawal requests yet.')}<div class="section-head mt-20"><h2>Gift catalogue</h2><button class="tiny-btn" data-action="admin-add-gift">Add gift</button></div><div class="gift-grid">${db.gifts.map(g=>`<button class="gift-item ${g.active?'':'disabled'}" data-action="admin-toggle-gift" data-gift="${g.id}"><span class="gift-emoji">${g.emoji}</span><strong>${esc(g.name)}</strong><small>◈${g.price} · ${g.active?'Active':'Hidden'}</small></button>`).join('')}</div>`; }
  function adminContent() { return `<div class="section-head"><h2>Announcements</h2><button class="tiny-btn" data-action="admin-add-announcement">Add</button></div>${db.announcements.map(a=>`<div class="list-card"><div class="notification-icon">📣</div><div class="list-main"><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div><button class="tiny-btn" data-action="admin-toggle-announcement" data-id="${a.id}">${a.active?'Disable':'Enable'}</button></div>`).join('')}<div class="section-head mt-20"><h2>Categories</h2></div><div class="category-row">${db.categories.map(c=>`<span class="category-chip active">${esc(c)}</span>`).join('')}</div><form id="category-form" class="promo-form"><input name="category" required placeholder="New category"><button class="secondary-btn">Add</button></form><div class="section-head mt-20"><h2>Backend activation</h2></div><div class="mode-card"><b>${esc(backendMode())}</b><span>Use config.js + supabase-schema.sql to enable the shared backend.</span><small>The public demo continues to work locally until configured.</small></div>`; }

  function handleSubmit(event) {
    event.preventDefault(); const form=event.target; const data=new FormData(form);
    if(form.id==='auth-form') return submitAuth(data);
    if(form.id==='create-room-form') return submitCreateRoom(data);
    if(form.id==='chat-form') return submitChat(data,form);
    if(form.id==='profile-form') return submitProfile(data);
    if(form.id==='withdraw-form') return submitWithdrawal(data);
    if(form.id==='promo-form') return submitPromo(data);
    if(form.id==='report-form') return submitReport(data);
    if(form.id==='category-form') return submitCategory(data);
  }

  async function submitChat(data,form) {
    const text=String(data.get('message')||'').trim(); const file=data.get('image');
    if(!text&&!(file&&file.size))return;
    const now=Date.now(); recentMessageTimes.push(now); while(recentMessageTimes.length&&now-recentMessageTimes[0]>10000)recentMessageTimes.shift();
    if(recentMessageTimes.length>db.moderation.maxMessagesPer10Seconds)return toast('Please slow down. Spam protection is active.','error');
    const lower=text.toLowerCase(); if(db.moderation.bannedWords.some(w=>lower.includes(w)))return toast('This message contains a blocked term.','error');
    let image=''; if(file&&file.size){if(file.size>1200000)return toast('Image must be under 1.2 MB.','error');image=await fileToDataUrl(file);}
    const room=roomById(state.roomId); db.messages[room.id]||=[]; const message={id:`m${now}`,userId:currentUserId,text,image,time:now,reactions:{},replyTo:state.replyTo,deleted:false}; db.messages[room.id].push(message); state.replyTo=null; progressTask('chat'); addXp(12); persistDb(); form.reset(); renderRoom();
  }

  async function submitProfile(data) {
    const me=currentUser(); const username=String(data.get('username')||me.username).trim().replace(/\s+/g,'.');
    if(db.users.some(u=>u.id!==me.id&&u.username.toLowerCase()===username.toLowerCase()))return toast('Username is already taken.','error');
    me.name=String(data.get('name')||me.name).trim(); me.username=username; me.bio=String(data.get('bio')||'').trim(); me.country=String(data.get('country')||'Bangladesh').trim(); me.age=Number(data.get('age'))||me.age; me.language=String(data.get('language')||'').trim(); me.interests=String(data.get('interests')||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,8);
    const file=data.get('avatar'); if(file&&file.size){if(file.size>900000)return toast('Please choose an image smaller than 900 KB.','error');me.avatar=await fileToDataUrl(file);}
    addXp(25); logActivity(`${me.name} updated profile`); persistDb(); closeModal(); render(); toast(t('profileSaved'),'success');
  }

  function submitCreateRoom(data) {
    const title=String(data.get('title')||'').trim(); const me=currentUser(); if(!title)return;
    if(me.role==='user')me.role='host'; const scheduledValue=String(data.get('scheduledAt')||''); const scheduledAt=scheduledValue?new Date(scheduledValue).getTime():null;
    const visibility=String(data.get('visibility')||'public'); const room={id:`r${Date.now()}`,title,title,titleEn:title,category:String(data.get('category')||'Community'),description:String(data.get('description')||'A new community room.').trim(),hostId:me.id,listeners:scheduledAt?0:1,locked:false,theme:(db.rooms.length%6)+1,seats:[me.id,null,null,null,null,null,null,null],createdAt:Date.now(),visibility,password:String(data.get('password')||''),scheduledAt,maxAudience:Math.max(10,Math.min(1000,Number(data.get('maxAudience'))||250)),featured:false,featuredRequested:data.get('featuredRequest')==='on',ended:false,moderators:[],coHosts:[],seatLocks:Array(8).fill(false),seatReserved:Array(8).fill(''),micRequests:[],pinnedMessageId:null,joinedUsers:scheduledAt?[]:[me.id],recentVisitors:[]};
    db.rooms.unshift(room); db.messages[room.id]=scheduledAt?[]:[{id:`m${Date.now()}`,userId:'system',text:`${me.name} opened the room.`,time:Date.now(),reactions:{},replyTo:null,image:'',deleted:false}]; logActivity(`${me.name} created room “${title}”`); addXp(50); persistDb(); closeModal(); if(scheduledAt){state.view='home';render();toast('Scheduled room created.','success');}else{state.roomId=room.id;render();toast(t('roomCreated'),'success');}
  }

  function submitWithdrawal(data) {
    const me=currentUser(); const amount=Number(data.get('amount')); if(!Number.isFinite(amount)||amount<500||amount>me.earnings)return toast('Enter a valid amount within your available earnings.','error');
    const account=String(data.get('account')||'').trim(); const method=String(data.get('method')||'bKash'); db.withdrawals.unshift({id:`w${Date.now()}`,userId:me.id,amount,method:`${method} · ${account}`,status:'pending',time:Date.now()}); me.earnings-=amount; notify(me.id,'৳','Withdrawal request submitted',`Your demo request for ৳${amount} is pending review.`); logActivity(`${me.name} submitted a withdrawal request`); persistDb(); openWallet('withdraw'); toast('Demo withdrawal request submitted.','success');
  }
  function submitPromo(data) { const code=String(data.get('code')||'').trim().toUpperCase(); const promo=db.promoCodes.find(p=>p.code===code&&p.active&&p.uses>0); if(!promo)return toast('Invalid or expired promo code.','error'); const usedKey=`voxa_promo_${currentUserId}_${code}`; if(localStorage.getItem(usedKey))return toast('You already used this code.','error'); currentUser().coins+=promo.coins;promo.uses-=1;localStorage.setItem(usedKey,'1');db.transactions.push({id:`t${Date.now()}`,userId:currentUserId,type:'promo',amount:promo.coins,label:`Promo ${code}`,time:Date.now()});persistDb();openWallet('balance');toast(`+${promo.coins} coins added.`,'success'); }
  function submitReport(data) { const targetType=String(data.get('targetType'));const targetId=String(data.get('targetId'));const reason=String(data.get('reason')||'').trim();const details=String(data.get('details')||'').trim();if(!reason)return;db.reports.push({id:`rp${Date.now()}`,reporterId:currentUserId,targetId,targetType,reason:details?`${reason}: ${details}`:reason,status:'open',time:Date.now()});if(targetType==='message'){const room=roomById(state.roomId);notify(room.hostId,'!','A message was reported','Review the latest room moderation report.');}logActivity(`New ${targetType} report submitted`);persistDb();closeModal();toast('Report submitted.','success'); }
  function submitCategory(data) { const c=String(data.get('category')||'').trim();if(!c||db.categories.includes(c))return;db.categories.push(c);logActivity(`Admin added category ${c}`);persistDb();render(); }

  function handleClick(event) {
    const el=event.target.closest('[data-action],[data-nav]'); if(!el)return; const nav=el.dataset.nav;
    if(nav){state.view=nav;state.roomId=null;closeModal();render();return;}
    const action=el.dataset.action;
    if(action==='auth-mode'){state.authMode=el.dataset.mode;render();}
    else if(action==='demo-login')loginAs(el.dataset.user);
    else if(action==='toggle-language')toggleLanguage();
    else if(action==='toggle-theme')toggleTheme();
    else if(action==='category'){state.category=el.dataset.category;render();}
    else if(action==='discover-mode'){state.discoverMode=el.dataset.mode;render();}
    else if(action==='room-filter'){state.roomFilter=el.dataset.category;render();}
    else if(action==='join-room')joinRoom(el.dataset.room);
    else if(action==='leave-room')leaveRoom();
    else if(action==='create-room')openCreateRoom();
    else if(action==='close-modal')closeModal();
    else if(action==='follow')toggleFollow(el.dataset.user);
    else if(action==='view-user')openUser(el.dataset.user);
    else if(action==='edit-profile')openEditProfile();
    else if(action==='wallet')openWallet();
    else if(action==='wallet-tab')openWallet(el.dataset.tab);
    else if(action==='logout')logout();
    else if(action==='gift')openGiftModal();
    else if(action==='gift-category'){state.giftCategory=el.dataset.category;openGiftModal();}
    else if(action==='send-gift')sendGift(el.dataset.gift,Number(el.dataset.combo)||1);
    else if(action==='room-tab'){state.roomPanel=el.dataset.tab;renderRoom();}
    else if(action==='mic')toggleMic();
    else if(action==='seat')takeSeat(Number(el.dataset.index));
    else if(action==='seat-options')openSeatOptions(Number(el.dataset.index));
    else if(action==='audience-options')openAudienceOptions(el.dataset.user);
    else if(action==='room-menu')openRoomMenu();
    else if(action==='share-room')shareRoom();
    else if(action==='toggle-room-lock')toggleRoomLock();
    else if(action==='leader-period'){state.leaderboardPeriod=el.dataset.period;render();}
    else if(action==='daily-checkin')dailyCheckIn();
    else if(action==='claim-task')claimTask(el.dataset.task);
    else if(action==='favorite-room')toggleFavoriteRoom(el.dataset.room);
    else if(action==='room-reminder')toggleRoomReminder(el.dataset.room);
    else if(action==='recharge')rechargeCoins(Number(el.dataset.coins));
    else if(action==='quick-reaction')quickReaction();
    else if(action==='reply-message'){state.replyTo=el.dataset.message;renderRoom();}
    else if(action==='cancel-reply'){state.replyTo=null;renderRoom();}
    else if(action==='react-message')reactMessage(el.dataset.message);
    else if(action==='delete-message')deleteMessage(el.dataset.message);
    else if(action==='pin-message')pinMessage(el.dataset.message);
    else if(action==='scroll-message')document.getElementById(`msg-${el.dataset.message}`)?.scrollIntoView({behavior:'smooth',block:'center'});
    else if(action==='approve-mic')approveMic(el.dataset.user);
    else if(action==='reject-mic')rejectMic(el.dataset.user);
    else if(action==='toggle-seat-lock')toggleSeatLock(Number(el.dataset.index));
    else if(action==='remove-seat-user')removeSeatUser(Number(el.dataset.index));
    else if(action==='reserve-seat')reserveSeat(Number(el.dataset.index));
    else if(action==='invite-to-seat')inviteToSeat(el.dataset.user);
    else if(action==='toggle-moderator')toggleModerator(el.dataset.user);
    else if(action==='kick-user')kickUser(el.dataset.user);
    else if(action==='host-transfer')openHostTransfer();
    else if(action==='transfer-host')transferHost(el.dataset.user);
    else if(action==='end-room')endRoom();
    else if(action==='block-user')blockUser(el.dataset.user);
    else if(action==='unblock-user')unblockUser(el.dataset.user);
    else if(action==='report-target')openReportModal(el.dataset.targetType,el.dataset.target);
    else if(action==='mark-all-read'){markNotificationsRead(currentUserId);render();}
    else if(action==='clear-notifications'){db.notifications=db.notifications.filter(n=>n.userId!==currentUserId);persistDb();render();}
    else if(action==='dismiss-announcement'){const a=db.announcements.find(x=>x.id===el.dataset.id);if(a)a.dismissedBy=[...new Set([...(a.dismissedBy||[]),currentUserId])];persistDb();render();}
    else if(action==='show-badges')showBadges();
    else if(action==='show-followers')showPeopleList('followers');
    else if(action==='show-following')showPeopleList('following');
    else if(action==='show-guidelines')showGuidelines();
    else if(action==='show-privacy')showPrivacy();
    else if(action==='admin-tab'){state.adminTab=el.dataset.tab;render();}
    else if(action==='admin-toggle-user')adminToggleUser(el.dataset.user);
    else if(action==='admin-toggle-verify')adminToggleVerify(el.dataset.user);
    else if(action==='admin-feature-room')adminFeatureRoom(el.dataset.room);
    else if(action==='admin-close-room')adminCloseRoom(el.dataset.room);
    else if(action==='resolve-report')resolveReport(el.dataset.report);
    else if(action==='admin-withdraw')adminWithdrawal(el.dataset.id,el.dataset.status);
    else if(action==='admin-toggle-gift')adminToggleGift(el.dataset.gift);
    else if(action==='admin-add-gift')adminAddGift();
    else if(action==='admin-add-announcement')adminAddAnnouncement();
    else if(action==='admin-toggle-announcement')adminToggleAnnouncement(el.dataset.id);
    else if(action==='reset-demo')resetDemo();
    else if(action==='install')installApp();
  }

  function joinRoom(id) {
    const room=roomById(id); if(!room||room.ended)return toast('This room has ended.','error');
    if(room.scheduledAt&&room.scheduledAt>Date.now())return toggleRoomReminder(id);
    if(room.visibility==='followers'&&!currentUser().following.includes(room.hostId)&&room.hostId!==currentUserId)return toast('This room is available to followers only.','error');
    if(room.password&&room.hostId!==currentUserId&&currentUser().role!=='admin'){const p=prompt('Enter room password:');if(p!==room.password)return toast('Incorrect room password.','error');}
    if(room.listeners>=room.maxAudience)return toast('This room is full.','error');
    room.listeners+=1;if(!room.joinedUsers.includes(currentUserId))room.joinedUsers.push(currentUserId);room.recentVisitors.unshift(currentUserId);currentUser().recentRooms=[id,...currentUser().recentRooms.filter(x=>x!==id)].slice(0,10);progressTask('room');addXp(10);state.roomId=id;state.roomPanel='chat';persistDb();render();
  }
  function leaveRoom(){const room=roomById(state.roomId);if(room)room.listeners=Math.max(0,room.listeners-1);state.roomId=null;state.micOn=false;state.replyTo=null;persistDb();render();}
  function toggleFollow(id) { const me=currentUser();if(id===me.id)return;const target=userById(id);const idx=me.following.indexOf(id);if(idx>=0){me.following.splice(idx,1);target.followers=Math.max(0,target.followers-1);}else{me.following.push(id);target.followers+=1;progressTask('follow');addXp(20);notify(id,'💜',`${me.name} followed you`,'You have a new follower.');}persistDb();if(modalRoot.innerHTML)openUser(id);else render(); }
  function dailyCheckIn(){const me=currentUser();if(me.lastCheckIn===todayKey())return toast('Already checked in today.');const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);me.streak=me.lastCheckIn===yesterday?me.streak+1:1;me.lastCheckIn=todayKey();me.coins+=50;progressTask('checkin');addXp(40);db.transactions.push({id:`t${Date.now()}`,userId:me.id,type:'checkin',amount:50,label:'Daily check-in reward',time:Date.now()});if(me.streak>=7&&!me.badges.includes('b5'))me.badges.push('b5');persistDb();render();toast('+50 coins and +40 XP','success');}
  function claimTask(id){const task=db.tasks.find(t=>t.id===id);if(!task||taskProgress(task)<task.target||isTaskClaimed(task))return;const me=currentUser();me.claimedTasks.push(`${todayKey()}:${task.id}`);me.coins+=task.reward;addXp(Math.round(task.reward/2));db.transactions.push({id:`t${Date.now()}`,userId:me.id,type:'mission',amount:task.reward,label:`Mission: ${task.title}`,time:Date.now()});persistDb();render();toast(`Mission reward: +${task.reward} coins`,'success');}
  function toggleFavoriteRoom(id){const a=currentUser().favoriteRooms;const i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.unshift(id);persistDb();closeModal();render();toast(i>=0?'Removed from favorites.':'Added to favorites.','success');}
  function toggleRoomReminder(id){const i=db.roomInvites.findIndex(x=>x.roomId===id&&x.userId===currentUserId&&x.type==='reminder');if(i>=0){db.roomInvites.splice(i,1);toast('Reminder removed.');}else{db.roomInvites.push({id:`ri${Date.now()}`,roomId:id,userId:currentUserId,type:'reminder',time:Date.now()});notify(currentUserId,'⏰','Room reminder set',`We will remind you about ${roomById(id).title}.`);toast('Reminder set.','success');}persistDb();render();}
  function rechargeCoins(coins){const me=currentUser();me.coins+=coins;db.transactions.push({id:`t${Date.now()}`,userId:me.id,type:'recharge',amount:coins,label:`Demo recharge ${coins} coins`,time:Date.now()});persistDb();openWallet('balance');toast(`+${coins} demo coins`,'success');}
  function sendGift(giftId,combo=1){const gift=db.gifts.find(g=>g.id===giftId);const me=currentUser();const room=roomById(state.roomId);const host=userById(room.hostId);const total=gift.price*combo;if(me.coins<total)return toast(t('notEnoughCoins'),'error');me.coins-=total;const creatorShare=Math.round(total*.7);host.earnings+=creatorShare;const now=Date.now();db.transactions.push({id:`t${now}`,userId:me.id,type:'gift',amount:-total,label:`${gift.name} ×${combo} sent to ${host.name}`,time:now});db.transactions.push({id:`t${now+1}`,userId:host.id,type:'earning',amount:creatorShare,label:`${gift.name} ×${combo} received from ${me.name}`,time:now});notify(host.id,gift.emoji,`You received ${gift.name} ×${combo}`,`${me.name} sent a gift in your room.`);db.messages[room.id].push({id:`m${now}`,userId:'system',text:`${me.name} sent ${gift.emoji} ${gift.name} ×${combo} to ${host.name}.`,time:now,reactions:{},replyTo:null,image:'',deleted:false});if(!me.badges.includes('b3'))me.badges.push('b3');addXp(Math.min(100,combo*5));persistDb();closeModal();renderRoom();const anim=document.createElement('div');anim.className='gift-animation combo';anim.textContent=`${gift.emoji} ×${combo}`;document.body.appendChild(anim);setTimeout(()=>anim.remove(),1800);toast(t('giftSent'),'success');}
  function quickReaction(){const emojis=['👏','💜','🔥','🎉'];const e=emojis[Math.floor(Math.random()*emojis.length)];const el=document.createElement('div');el.className='floating-reaction';el.textContent=e;document.body.appendChild(el);setTimeout(()=>el.remove(),1600);}
  function reactMessage(id){const m=(db.messages[state.roomId]||[]).find(x=>x.id===id);if(!m)return;const e='❤';m.reactions[e]||=[];const i=m.reactions[e].indexOf(currentUserId);if(i>=0)m.reactions[e].splice(i,1);else m.reactions[e].push(currentUserId);persistDb();renderRoom();}
  function deleteMessage(id){const m=(db.messages[state.roomId]||[]).find(x=>x.id===id);if(!m)return;m.deleted=true;m.deletedBy=m.userId===currentUserId?'self':'moderator';m.text='';m.image='';persistDb();renderRoom();}
  function pinMessage(id){const room=roomById(state.roomId);if(!isHostOrMod(room))return;room.pinnedMessageId=room.pinnedMessageId===id?null:id;persistDb();renderRoom();toast(room.pinnedMessageId?'Message pinned.':'Message unpinned.','success');}
  function toggleMic(){const room=roomById(state.roomId);const seat=room.seats.indexOf(currentUserId);if(seat<0){if(!room.micRequests.includes(currentUserId))room.micRequests.push(currentUserId);notify(room.hostId,'🎤','New mic request',`${currentUser().name} requested a speaker seat.`);persistDb();renderRoom();return toast(t('micRequested'),'success');}state.micOn=!state.micOn;renderRoom();toast(state.micOn?t('micOn'):t('micOff'));}
  function takeSeat(index){const room=roomById(state.roomId);if(room.seatLocks[index]&&!isHostOrMod(room))return toast('This seat is locked.','error');if(room.seatReserved[index]&&room.seatReserved[index]!==currentUserId&&!isHostOrMod(room))return toast('This seat is reserved.','error');if(room.seats[index]&&room.seats[index]!==currentUserId)return openUser(room.seats[index]);if(!isHostOrMod(room)&&!room.micRequests.includes(currentUserId)&&room.hostId!==currentUserId)return toggleMic();const old=room.seats.indexOf(currentUserId);if(old>=0)room.seats[old]=null;room.seats[index]=currentUserId;room.micRequests=room.micRequests.filter(x=>x!==currentUserId);state.micOn=true;persistDb();renderRoom();toast(t('micOn'),'success');}
  function approveMic(userId){const room=roomById(state.roomId);const empty=room.seats.findIndex((x,i)=>!x&&!room.seatLocks[i]&&(!room.seatReserved[i]||room.seatReserved[i]===userId));if(empty<0)return toast('No speaker seat available.','error');room.seats[empty]=userId;room.micRequests=room.micRequests.filter(x=>x!==userId);notify(userId,'🎙','Mic request accepted',`You were moved to a speaker seat in ${room.title}.`);persistDb();renderRoom();}
  function rejectMic(userId){const room=roomById(state.roomId);room.micRequests=room.micRequests.filter(x=>x!==userId);notify(userId,'🎤','Mic request declined',`The host declined your request in ${room.title}.`);persistDb();renderRoom();}
  function toggleSeatLock(index){const room=roomById(state.roomId);room.seatLocks[index]=!room.seatLocks[index];if(room.seatLocks[index]&&room.seats[index]&&room.seats[index]!==room.hostId)room.seats[index]=null;persistDb();closeModal();renderRoom();}
  function removeSeatUser(index){const room=roomById(state.roomId);room.seats[index]=null;persistDb();closeModal();renderRoom();}
  function reserveSeat(index){const room=roomById(state.roomId);const name=prompt('Enter username to reserve this seat for:');if(!name)return;const u=db.users.find(x=>x.username.toLowerCase()===name.trim().replace(/^@/,'').toLowerCase());if(!u)return toast('User not found.','error');room.seatReserved[index]=u.id;persistDb();closeModal();renderRoom();}
  function inviteToSeat(userId){const room=roomById(state.roomId);const empty=room.seats.findIndex((x,i)=>!x&&!room.seatLocks[i]);if(empty<0)return toast('No seat available.','error');room.seats[empty]=userId;notify(userId,'🎙','Speaker invitation',`You were invited to a speaker seat in ${room.title}.`);persistDb();closeModal();renderRoom();}
  function toggleModerator(userId){const room=roomById(state.roomId);const i=room.moderators.indexOf(userId);if(i>=0)room.moderators.splice(i,1);else room.moderators.push(userId);notify(userId,'🛡','Room role updated',i>=0?`Moderator role removed in ${room.title}.`:`You are now a moderator in ${room.title}.`);persistDb();closeModal();renderRoom();}
  function kickUser(userId){const room=roomById(state.roomId);room.joinedUsers=room.joinedUsers.filter(x=>x!==userId);room.seats=room.seats.map(x=>x===userId?null:x);room.listeners=Math.max(0,room.listeners-1);notify(userId,'↪','Removed from room',`A moderator removed you from ${room.title}.`);persistDb();closeModal();renderRoom();}
  function openHostTransfer(){const room=roomById(state.roomId);const members=[...new Set(room.joinedUsers)].filter(id=>id!==room.hostId).map(userById).filter(Boolean);openModal(`${modalHead('Transfer host')}${members.map(u=>`<button class="host-card full" data-action="transfer-host" data-user="${u.id}">${avatar(u,'sm')}<span class="host-info"><strong>${esc(u.name)}</strong><small>@${esc(u.username)}</small></span></button>`).join('')||emptyState('○','No eligible members','Invite someone to the room first.')}`);}
  function transferHost(userId){const room=roomById(state.roomId);const old=room.hostId;room.hostId=userId;if(!room.coHosts.includes(old))room.coHosts.push(old);notify(userId,'👑','You are now the host',`Host ownership of ${room.title} was transferred to you.`);logActivity(`Host transferred for room ${room.title}`);persistDb();closeModal();renderRoom();}
  function endRoom(){const room=roomById(state.roomId);if(!confirm('End this room for everyone?'))return;room.ended=true;room.listeners=0;logActivity(`Room “${room.title}” ended`);persistDb();closeModal();state.roomId=null;render();toast('Room ended.','success');}
  function blockUser(id){const me=currentUser();if(!me.blockedUsers.includes(id))me.blockedUsers.push(id);me.following=me.following.filter(x=>x!==id);persistDb();closeModal();toast('User blocked.','success');}
  function unblockUser(id){currentUser().blockedUsers=currentUser().blockedUsers.filter(x=>x!==id);persistDb();closeModal();render();toast('User unblocked.','success');}
  function openReportModal(type,id){const reasons=type==='message'?['Harassment','Spam','Hate speech','Privacy violation','Other']:type==='room'?['Unsafe room','Misleading title','Harassment','Spam','Other']:['Harassment','Impersonation','Spam','Unsafe behaviour','Other'];openModal(`${modalHead(`Report ${type}`)}<form id="report-form"><input type="hidden" name="targetType" value="${esc(type)}"><input type="hidden" name="targetId" value="${esc(id)}"><div class="field"><label>Reason</label><select name="reason">${reasons.map(r=>`<option>${r}</option>`).join('')}</select></div><div class="field"><label>Details</label><textarea name="details" maxlength="300" placeholder="Add helpful context"></textarea></div><button class="primary-btn full">Submit report</button></form>`);}
  function showBadges(){const me=currentUser();openModal(`${modalHead('Achievements')}<div class="badge-grid">${db.badges.map(b=>`<div class="badge-card ${me.badges.includes(b.id)?'earned':'locked'}"><span>${b.icon}</span><strong>${esc(b.name)}</strong><p>${esc(b.description)}</p><small>${me.badges.includes(b.id)?'Earned':'Locked'}</small></div>`).join('')}</div>`);}
  function showPeopleList(type){const me=currentUser();const users=type==='following'?me.following.map(userById).filter(Boolean):db.users.filter(u=>u.following.includes(me.id));openModal(`${modalHead(type==='following'?t('following'):t('followers'))}${users.map(hostCard).join('')||emptyState('○','No users','This list is empty.')}`);}
  function showGuidelines(){openModal(`${modalHead('Community guidelines')}<div class="policy-copy"><h3>Be respectful</h3><p>No harassment, threats, hate speech, sexual exploitation, scams or sharing private information.</p><h3>Protect minors</h3><p>Users must meet the minimum age requirement. Report any unsafe interaction immediately.</p><h3>Authenticity and consent</h3><p>Do not impersonate people, record others without consent or mislead users about payments.</p><h3>Moderation</h3><p>Hosts and platform administrators may remove content or suspend accounts that violate these rules.</p></div>`);}
  function showPrivacy(){openModal(`${modalHead('Privacy summary')}<div class="policy-copy"><p>This demo stores data in your browser in local mode. It does not process real payments or real voice.</p><p>When Supabase is enabled, authentication and shared app records are stored in that project. Configure row-level security using the included SQL file.</p><p>Do not collect sensitive identity or financial information until a proper privacy policy, consent flow and security review are completed.</p></div>`);}

  function adminToggleVerify(id){const u=userById(id);u.verified=!u.verified;logActivity(`Admin ${u.verified?'verified':'unverified'} ${u.name}`);persistDb();render();}
  function adminFeatureRoom(id){const r=roomById(id);r.featured=!r.featured;logActivity(`Admin ${r.featured?'featured':'unfeatured'} room ${r.title}`);persistDb();render();}
  function adminCloseRoom(id){const r=roomById(id);r.ended=!r.ended;if(r.ended)r.listeners=0;logActivity(`Admin ${r.ended?'closed':'reopened'} room ${r.title}`);persistDb();render();}
  function adminWithdrawal(id,status){const w=db.withdrawals.find(x=>x.id===id);if(!w||w.status!=='pending')return;w.status=status;const u=userById(w.userId);if(status==='rejected')u.earnings+=w.amount;notify(u.id,'৳',`Withdrawal ${status}`,status==='approved'?`Your demo request for ৳${w.amount} was approved.`:`Your request was rejected and the demo balance was restored.`);logActivity(`Admin ${status} withdrawal ${id}`);persistDb();render();}
  function adminToggleGift(id){const g=db.gifts.find(x=>x.id===id);g.active=!g.active;logActivity(`Admin ${g.active?'enabled':'disabled'} gift ${g.name}`);persistDb();render();}
  function adminAddGift(){const name=prompt('Gift name:');if(!name)return;const emoji=prompt('Emoji:','🎁')||'🎁';const price=Number(prompt('Coin price:','100'));if(!price)return;db.gifts.push({id:`g${Date.now()}`,name:name.trim(),emoji,price,category:'Classic',active:true});logActivity(`Admin added gift ${name}`);persistDb();render();}
  function adminAddAnnouncement(){const title=prompt('Announcement title:');if(!title)return;const text=prompt('Announcement text:');if(!text)return;db.announcements.unshift({id:`a${Date.now()}`,title,text,active:true,time:Date.now()});logActivity(`Admin published announcement ${title}`);persistDb();render();}
  function adminToggleAnnouncement(id){const a=db.announcements.find(x=>x.id===id);a.active=!a.active;logActivity(`Admin ${a.active?'enabled':'disabled'} announcement ${a.title}`);persistDb();render();}
  function adminToggleUser(userId){if(currentUser().role!=='admin')return;const u=userById(userId);u.status=u.status==='active'?'blocked':'active';logActivity(`Admin changed ${u.name} to ${u.status}`);persistDb();render();}
  function resolveReport(id){if(currentUser().role!=='admin')return;const r=db.reports.find(x=>x.id===id);if(r)r.status='resolved';logActivity(`Admin resolved report ${id}`);persistDb();render();}
  function resetDemo(){if(!confirm('Reset all Voxa 2.0 demo data in this browser?'))return;localStorage.removeItem(DB_KEY);db=seedDatabase();upgradeDatabase();persistDb();currentUserId='admin';localStorage.setItem(SESSION_KEY,'admin');state.view='admin';state.adminTab='overview';render();toast('Voxa 2.0 demo reset complete.','success');}

  if(syncChannel){syncChannel.onmessage=event=>{if(event.data?.type==='db-sync'){const incoming=loadJSON(DB_KEY,null);if(incoming){db=incoming;render();}}};}
  window.addEventListener('storage',event=>{if(event.key===DB_KEY&&event.newValue){try{db=JSON.parse(event.newValue);render();}catch{}}});

  upgradeDatabase();
  persistDb();


  async function installApp(){
    if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;return;}
    toast(settings.language==='bn'?'Browser menu থেকে “Add to Home screen” নির্বাচন করুন।':'Choose “Add to Home screen” from your browser menu.');
  }

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;});
  document.addEventListener('submit',handleSubmit);
  document.addEventListener('click',handleClick);
  document.addEventListener('input',handleInput);
  window.addEventListener('hashchange',()=>{
    const match=location.hash.match(/room=([^&]+)/); if(match&&currentUser()){const room=roomById(match[1]);if(room){state.roomId=room.id;render();}}
  });

  if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

  render();

  if (window.VoxaBackend?.configured()) {
    window.VoxaBackend.init().then(async ready => {
      if (!ready) return toast('Supabase configuration could not be loaded; continuing in local mode.','error');
      const shared = await window.VoxaBackend.load();
      if (shared && Array.isArray(shared.users) && shared.users.length) {
        db = shared;
        upgradeDatabase();
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        render();
        toast('Shared demo backend connected.','success');
      } else {
        await window.VoxaBackend.save(db);
      }
      window.VoxaBackend.subscribe(payload => {
        if (!payload || !Array.isArray(payload.users)) return;
        db = payload;
        upgradeDatabase();
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        render();
      });
    }).catch(()=>{});
  }
})();
