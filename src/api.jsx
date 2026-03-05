import { supabase } from './utils/supabase.jsx';

export const request = async (endpoint, body = null, method = "GET") => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const url = `${baseUrl}${endpoint}`;

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
};