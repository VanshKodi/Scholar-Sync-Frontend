import { createClient } from "@supabase/supabase-js/dist/index.cjs";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
export const checkUserSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error(error)
    return null
  }
  
  return data.session
}