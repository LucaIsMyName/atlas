export const formatUrl = (url: string): string => {
  if (!url) return 'https://www.google.com';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.includes('.') && !url.includes(' ')) return `https://${url}`;
  return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
};

export const getFaviconUrl = (url: string): string | null => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
};