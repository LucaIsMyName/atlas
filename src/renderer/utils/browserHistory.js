// browserHistory.js
class TabHistory {
  constructor(initialUrl, limit = 50) {
    this.urls = [initialUrl];
    this.currentIndex = 0;
    this.limit = limit;
  }

  canGoBack() {
    return this.currentIndex > 0 && this.urls.length > 1;
  }

  canGoForward() {
    return this.currentIndex < this.urls.length - 1 && this.urls.length > 1;
  }

  addUrl(url) {
    if (url === this.getCurrentUrl()) {
      return;
    }

    this.urls = this.urls.slice(0, this.currentIndex + 1);
    this.urls.push(url);
    this.currentIndex++;

    if (this.urls.length > this.limit) {
      const overflow = this.urls.length - this.limit;
      this.urls = this.urls.slice(overflow);
      this.currentIndex = Math.max(0, this.currentIndex - overflow);
    }
  }

  goBack() {
    if (this.canGoBack()) {
      this.currentIndex--;
      return this.getCurrentUrl();
    }
    return null;
  }

  goForward() {
    if (this.canGoForward()) {
      this.currentIndex++;
      return this.getCurrentUrl();
    }
    return null;
  }

  getCurrentUrl() {
    return this.urls[this.currentIndex];
  }

  toJSON() {
    return {
      urls: this.urls,
      currentIndex: this.currentIndex,
      limit: this.limit
    };
  }

  static fromJSON(json) {
    const history = new TabHistory(json.urls[0], json.limit);
    history.urls = json.urls;
    history.currentIndex = json.currentIndex;
    return history;
  }
}

const createNewTab = (url = 'https://www.google.com', title = 'New Tab') => {
  return {
    id: Date.now().toString(),
    url,
    title,
    isLoading: false,
    history: new TabHistory(url),
  };
};

const handleBack = (tabs, tabId, webviewRef) => {
  return tabs.map(tab => {
    if (tab.id === tabId) {
      const newUrl = tab.history.goBack();
      if (newUrl && webviewRef.current) {
        webviewRef.current.src = newUrl;
        return {
          ...tab,
          url: newUrl,
          isLoading: true
        };
      }
    }
    return tab;
  });
};

const handleForward = (tabs, tabId, webviewRef) => {
  return tabs.map(tab => {
    if (tab.id === tabId) {
      const newUrl = tab.history.goForward();
      if (newUrl && webviewRef.current) {
        webviewRef.current.src = newUrl;
        return {
          ...tab,
          url: newUrl,
          isLoading: true
        };
      }
    }
    return tab;
  });
};

const handleNavigation = (tabs, tabId, newUrl) => {
  return tabs.map(tab => {
    if (tab.id === tabId) {
      tab.history.addUrl(newUrl);
      return {
        ...tab,
        url: newUrl
      };
    }
    return tab;
  });
};

const saveTabs = (tabs) => {
  const tabsForStorage = tabs.map(tab => ({
    ...tab,
    history: tab.history.toJSON()
  }));
  localStorage.setItem('browser_tabs', JSON.stringify(tabsForStorage));
};

const loadTabs = () => {
  const storedTabs = localStorage.getItem('browser_tabs');
  const storedActiveTabId = localStorage.getItem('browser_active_tab');
  
  if (!storedTabs) {
    const initialTab = createNewTab();
    localStorage.setItem('browser_active_tab', initialTab.id);
    return [initialTab];
  }

  try {
    const parsedTabs = JSON.parse(storedTabs);
    const tabs = parsedTabs.map(tab => ({
      ...tab,
      history: TabHistory.fromJSON(tab.history)
    }));

    const activeTabExists = tabs.some(tab => tab.id === storedActiveTabId);
    if (!activeTabExists) {
      localStorage.setItem('browser_active_tab', tabs[0].id);
    }

    return tabs;
  } catch (error) {
    console.error('Error loading tabs:', error);
    const initialTab = createNewTab();
    localStorage.setItem('browser_active_tab', initialTab.id);
    return [initialTab];
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