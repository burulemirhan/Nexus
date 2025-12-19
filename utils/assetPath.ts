/**
 * Get the correct asset path with base URL prefix
 * @param path - Asset path starting with /assets/
 * @returns Path with base URL prefix
 */
export const getAssetPath = (path: string): string => {
  const baseUrl = import.meta.env.BASE_URL;
  // Remove leading slash from path if present, then combine with baseUrl
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // baseUrl already ends with /, so we combine directly
  return `${baseUrl}${cleanPath}`;
};
