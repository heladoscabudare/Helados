// js/supabaseClient.js
// Inicializa el cliente de Supabase
const _supabase = window.supabase || supabase;
const supabase = _supabase.createClient(SUPABASE_URL, SUPABASE_KEY);