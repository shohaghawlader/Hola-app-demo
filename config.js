/*
  Voxa backend configuration.
  Keep backend: 'local' for the zero-setup browser demo.
  To enable the optional shared Supabase demo backend:
  1. Run supabase-schema.sql in a Supabase project.
  2. Add the project URL and anon key below.
  3. Change backend to 'supabase'.

  IMPORTANT: The shared-state adapter is suitable for demos, not production.
*/
window.VOXA_CONFIG = {
  backend: 'local',
  supabaseUrl: '',
  supabaseAnonKey: '',
  sharedStateId: 'main'
};
