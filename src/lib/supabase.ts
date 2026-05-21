import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las credenciales de Supabase en el archivo .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function savePolicy(policyData: any) {
  return await supabase.from('policies').insert(policyData);
}
