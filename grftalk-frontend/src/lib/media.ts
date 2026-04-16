const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export const resolveMediaUrl = (src: string) => {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (!API_BASE_URL) return src;

  return src.startsWith("/") ? `${API_BASE_URL}${src}` : `${API_BASE_URL}/${src}`;
};
