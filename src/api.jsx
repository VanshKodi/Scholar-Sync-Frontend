export const request = async (endpoint, options = {}) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
};