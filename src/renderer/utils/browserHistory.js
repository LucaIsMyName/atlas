class TabHistory {
  constructor(initialUrl, limit = 50) {
    this.urls = initialUrl ? [initialUrl] : [];
    this.currentIndex = this.urls.length - 1;
    this.limit = limit;
  }

  canGoBack() {
    return this.currentIndex > 0;
  }

  canGoForward() {
    return this.currentIndex < this.urls.length - 1;
  }

  addUrl(url) {
    // Prevent adding duplicate consecutive URLs
    if (url === this.getCurrentUrl()) return;

    // Remove all entries after current index before adding new URL
    this.urls = this.urls.slice(0, this.currentIndex + 1);
    
    // Add new URL
    this.urls.push(url);
    this.currentIndex = this.urls.length - 1;

    // Maintain history limit
    if (this.urls.length > this.limit) {
      const overflow = this.urls.length - this.limit;
      this.urls = this.urls.slice(overflow);
      this.currentIndex = Math.max(0, this.currentIndex - overflow);
    }
  }

  goBack() {
    if (!this.canGoBack()) return null;
    this.currentIndex--;
    return this.getCurrentUrl();
  }

  goForward() {
    if (!this.canGoForward()) return null;
    this.currentIndex++;
    return this.getCurrentUrl();
  }

  getCurrentUrl() {
    return this.urls[this.currentIndex] || null;
  }

  toJSON() {
    return {
      urls: this.urls,
      currentIndex: this.currentIndex,
      limit: this.limit
    };
  }

  static fromJSON(json) {
    if (!json || !Array.isArray(json.urls)) {
      console.error('Invalid history JSON:', json);
      return new TabHistory(null);
    }
    const history = new TabHistory(null);
    history.urls = json.urls;
    history.currentIndex = Math.min(json.currentIndex, json.urls.length - 1);
    history.limit = json.limit;
    return history;
  }
}

const createNewTab = (url = 'https://www.google.com', title = 'New Tab') => ({
  id: Date.now().toString(),
  url,
  title,
  isLoading: false,
  history: new TabHistory(url)
});

const handleBack = (tabs, tabId, webviewRef) => {
  return tabs.map(tab => {
    if (tab.id !== tabId) return tab;
    
    const newUrl = tab.history.goBack();
    if (!newUrl || !webviewRef.current) return tab;

    webviewRef.current.src = newUrl;
    return { ...tab, url: newUrl, isLoading: true };
  });
};

const handleForward = (tabs, tabId, webviewRef) => {
  return tabs.map(tab => {
    if (tab.id !== tabId) return tab;
    
    const newUrl = tab.history.goForward();
    if (!newUrl || !webviewRef.current) return tab;

    webviewRef.current.src = newUrl;
    return { ...tab, url: newUrl, isLoading: true };
  });
};

const handleNavigation = (tabs, tabId, newUrl) => {
  return tabs.map(tab => {
    if (tab.id !== tabId) return tab;
    
    // Deep clone the tab to prevent state mutations
    const updatedTab = {
      ...tab,
      history: new TabHistory(null)
    };
    
    // Reconstruct history state
    updatedTab.history.urls = [...tab.history.urls];
    updatedTab.history.currentIndex = tab.history.currentIndex;
    updatedTab.history.limit = tab.history.limit;
    
    // Add new URL to history
    updatedTab.history.addUrl(newUrl);
    
    return {
      ...updatedTab,
      url: newUrl
    };
  });
};

const saveTabs = (tabs) => {
  try {
    const tabsForStorage = tabs.map(tab => ({
      ...tab,
      history: tab.history.toJSON()
    }));
    localStorage.setItem('browser_tabs', JSON.stringify(tabsForStorage));
  } catch (error) {
    console.error('Error saving tabs:', error);
  }
};

const loadTabs = () => {
  try {
    const storedTabs = localStorage.getItem('browser_tabs');
    if (!storedTabs) return [createNewTab()];

    const parsedTabs = JSON.parse(storedTabs);
    return parsedTabs.map(tab => ({
      ...tab,
      history: TabHistory.fromJSON(tab.history)
    }));
  } catch (error) {
    console.error('Error loading tabs:', error);
    return [createNewTab()];
  }
};

export {
  TabHistory,
  createNewTab,
  handleBack,
  handleForward,
  handleNavigation,
  saveTabs,
  loadTabs
};