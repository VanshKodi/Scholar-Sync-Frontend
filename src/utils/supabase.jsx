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
export const getProfile = async () => {
  // 1. Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("No active session found:", sessionError);
    return null;
  }

  // 2. Use the ID from the session to fetch the profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('profile_id', session.user.id) // Using profile_id from your schema
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
  console.log("Profile data:", data);

  return data;
};