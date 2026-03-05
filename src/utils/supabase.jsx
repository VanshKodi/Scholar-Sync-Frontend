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

  // 2. Fetch the profile and its university membership (if any)
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      university_members (
        role,
        joined_at,
        university (
          university_id,
          university_name,
          university_domain
        )
      )
    `)
    .eq('profile_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  return data;
};