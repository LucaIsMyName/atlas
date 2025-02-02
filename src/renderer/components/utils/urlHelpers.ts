export const formatUrl = (url: string): string => {
  if (!url) return 'https://www.google.com';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.includes('.') && !url.includes(' ')) return `https://${url}`;
  return `${getSearchEngineUrl()}${encodeURIComponent(url)}`;
};

const getSearchEngineUrl = () => {
  const engine = localStorage.getItem('browser_search_engine') || 'google';
  const engines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q=',
    ecosia: 'https://www.ecosia.org/search?q='
  };
  return engines[engine] || engines.google;
};
export const getFaviconUrl = (url: string): string | null => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
};