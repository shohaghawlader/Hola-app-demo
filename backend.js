(() => {
  'use strict';
  let client = null;
  let channel = null;
  let saveTimer = null;
  let lastRemoteUpdate = 0;

  const config = () => window.VOXA_CONFIG || {};
  const configured = () => config().backend === 'supabase' && /^https:\/\//.test(config().supabaseUrl || '') && !!config().supabaseAnonKey;

  async function init() {
    if (!configured()) return false;
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      client = mod.createClient(config().supabaseUrl, config().supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        realtime: { params: { eventsPerSecond: 5 } }
      });
      return true;
    } catch (error) {
      console.warn('Voxa Supabase adapter could not initialize:', error);
      return false;
    }
  }

  async function load() {
    if (!client) return null;
    const { data, error } = await client.from('voxa_demo_state').select('payload, updated_at').eq('id', config().sharedStateId || 'main').maybeSingle();
    if (error) { console.warn('Voxa shared state load failed:', error); return null; }
    if (data?.updated_at) lastRemoteUpdate = new Date(data.updated_at).getTime();
    return data?.payload || null;
  }

  async function save(payload) {
    if (!client) return false;
    window.clearTimeout(saveTimer);
    return new Promise(resolve => {
      saveTimer = window.setTimeout(async () => {
        const { error } = await client.from('voxa_demo_state').upsert({
          id: config().sharedStateId || 'main',
          payload,
          updated_at: new Date().toISOString()
        });
        if (error) console.warn('Voxa shared state save failed:', error);
        resolve(!error);
      }, 350);
    });
  }

  function subscribe(onChange) {
    if (!client || channel) return;
    channel = client.channel('voxa-demo-state')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'voxa_demo_state', filter: `id=eq.${config().sharedStateId || 'main'}` }, payload => {
        const updatedAt = new Date(payload.new?.updated_at || 0).getTime();
        if (updatedAt && updatedAt <= lastRemoteUpdate) return;
        lastRemoteUpdate = updatedAt;
        if (payload.new?.payload) onChange(payload.new.payload);
      })
      .subscribe();
  }

  window.VoxaBackend = { configured, init, load, save, subscribe };
})();
