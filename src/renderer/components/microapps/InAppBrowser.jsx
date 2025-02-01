import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import SettingsModal from './SettingsModal';
import { formatUrl } from '../utils/urlHelpers';

const STORAGE_KEYS = {
  TABS: 'browser_tabs',
  ACTIVE_TAB: 'browser_active_tab',
  THEME: 'browser_theme',
  LAYOUT: 'browser_layout'
};

const InAppBrowser = () => {
  const webviewRef = React.useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const [layout, setLayout] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.LAYOUT) || 'topbar'
  );


  // Initialize tabs
  const [tabs, setTabs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TABS);
      return stored ? JSON.parse(stored) : [
        { id: '1', url: 'https://www.google.com', title: 'Google', isLoading: false }
      ];
    } catch {
      return [{ id: '1', url: 'https://www.google.com', title: 'Google', isLoading: false }];
    }
  });

  // Initialize active tab
  const [activeTabId, setActiveTabId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || tabs[0]?.id;
    } catch {
      return tabs[0]?.id;
    }
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTabId);
  }, [tabs, activeTabId]);

  // Watch for layout changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.LAYOUT) {
        setLayout(e.newValue || 'topbar');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Tab management functions
  const handleNewTab = () => {
    const newTab = {
      id: Date.now().toString(),
      url: 'https://www.google.com',
      title: 'New Tab',
      isLoading: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (tabId === activeTabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      return newTabs.length > 0 ? newTabs : [
        { id: Date.now().toString(), url: 'https://www.google.com', title: 'Google', isLoading: false }
      ];
    });
  };

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
  };

  // URL handling
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!webviewRef.current) return;

    const formattedUrl = formatUrl(urlInput);
    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId ? { ...tab, url: formattedUrl, isLoading: true } : tab
    ));

    webviewRef.current.src = formattedUrl;
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle layout changes
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };


  // Webview event handlers
  useEffect(() => {
    if (!webviewRef.current) return;

    const handleLoadStart = () => {
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId ? { ...tab, isLoading: true } : tab
      ));
    };

    const handleLoadStop = () => {
      if (!webviewRef.current) return;

      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId ? {
          ...tab,
          isLoading: false,
          title: webviewRef.current.getTitle() || tab.url,
          url: webviewRef.current.getURL()
        } : tab
      ));
      setUrlInput(webviewRef.current.getURL());
    };

    webviewRef.current.addEventListener('did-start-loading', handleLoadStart);
    webviewRef.current.addEventListener('did-stop-loading', handleLoadStop);

    return () => {
      if (webviewRef.current) {
        webviewRef.current.removeEventListener('did-start-loading', handleLoadStart);
        webviewRef.current.removeEventListener('did-stop-loading', handleLoadStop);
      }
    };
  }, [activeTabId]);

  // Shared props for navigation components
  const navigationProps = {
    tabs,
    activeTabId,
    urlInput,
    onUrlSubmit: handleUrlSubmit,
    onUrlChange: setUrlInput,
    onNewTab: handleNewTab,
    onCloseTab: handleCloseTab,
    onTabClick: handleTabClick,
    onSettingsOpen: () => setIsSettingsOpen(true)
  };

  return (
    <div className="h-screen flex">
      {/* Layout Selection */}
      {layout === 'sidebar' ? (
        <div className="flex flex-1 h-full">
          <SideBar {...navigationProps} />
          <div className="flex-1 w-full">
            {/* Window Controls for Sidebar Layout */}
            <div
              className=" flex flex-1 w-full items-center px-3"
              style={{ WebkitAppRegion: 'drag' }}
            >

            </div>
            {/* Browser Content */}
            <div className="flex-1 w-full h-screen rounded-lg overflow-hidden shadow-inner">
              {activeTab && (
                <webview
                  ref={webviewRef}
                  src={activeTab.url}
                  className="bg-background max-w-[calc(100%-theme(spacing.4)/2)] h-[calc(100vh-theme(spacing.4)/2)] mt-1 ml-1 rounded-lg overflow-hidden"
                  webpreferences="nodeIntegration=false, contextIsolation=true"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        // TopBar Layout
        <div className="flex flex-col items-between shadow-inner w-full h-full pb-1 bg-background">
          <TopBar {...navigationProps} />
          <div className="flex-1 bg-background ">
            {activeTab && (
              <webview
                ref={webviewRef}
                src={activeTab.url}
                className="w-full ml-1 max-w-[calc(100%-theme(spacing.4)/2)] h-full rounded-lg overflow-hidden"
                webpreferences="nodeIntegration=false, contextIsolation=true"
              />
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLayoutChange={handleLayoutChange}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
};

export default InAppBrowser;