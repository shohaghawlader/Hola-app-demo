(function(){
  const agents = window.AGENTS || [];
  const $ = (selector) => document.querySelector(selector);
  const search = $('#hubSearch');
  const button = $('#verifyButton');
  const message = $('#searchMessage');
  const profile = {
    title: $('#profileTitle'),
    status: $('#profileStatus'),
    meta: $('#profileMeta'),
    id: $('#profileId'),
    rating: $('#profileRating'),
    checks: $('#profileChecks'),
    avatar: $('#profileAvatar'),
    directory: $('#viewDirectory')
  };

  function initials(name){
    return String(name || 'AB').split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase();
  }

  function directoryLink(tier){
    if(tier === 'Master Agent') return 'master-agents.html';
    if(tier === 'Super Agent') return 'super-agents.html';
    if(tier === 'Sub Admin') return 'sub-admins.html';
    return 'master-agents.html';
  }

  function showAgent(agent){
    if(!agent) return;
    profile.title.textContent = agent.name;
    profile.status.textContent = agent.status;
    profile.status.classList.toggle('limited', agent.status !== 'Available');
    profile.meta.textContent = `${agent.tier} · ${agent.area}`;
    profile.id.textContent = agent.id;
    profile.rating.textContent = `${Number(agent.rating).toFixed(1)} / 5`;
    profile.checks.textContent = Number(agent.checks).toLocaleString();
    profile.avatar.textContent = initials(agent.name);
    profile.directory.href = directoryLink(agent.tier);
  }

  function findAgent(){
    const query = (search.value || '').trim().toLowerCase();
    message.className = 'search-message';

    if(!query){
      message.textContent = 'Enter a name, profile ID or area to verify a sample listing.';
      search.focus();
      return;
    }

    const exact = agents.find(a => a.id.toLowerCase() === query || a.name.toLowerCase() === query);
    const match = exact || agents.find(a => `${a.name} ${a.id} ${a.area} ${a.tier}`.toLowerCase().includes(query));

    if(match){
      showAgent(match);
      message.classList.add('success');
      message.textContent = `Sample match found: ${match.id}. Confirm current details with support.`;
    }else{
      message.classList.add('error');
      message.textContent = 'No sample profile matched that search. Try MA-1001, a name, or an area.';
    }
  }

  button?.addEventListener('click', findAgent);
  search?.addEventListener('keydown', event => {
    if(event.key === 'Enter') findAgent();
  });

  if(agents.length) showAgent(agents[0]);
})();
