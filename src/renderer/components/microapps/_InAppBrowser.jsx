
import React, { useState, useEffect } from 'react';
import TopBar from '../layout/TopBar';
import SideBar from '../layout/SideBar';
import { formatUrl } from '../utils/urlHelpers';
import GradientLayer from '../layout/GradientLayer';

const STORAGE_KEYS = {
  TABS: 'browser_tabs',
  ACTIVE_TAB: 'browser_active_tab',
  THEME: 'browser_theme',
  LAYOUT: 'browser_layout',
  SIDEBAR_COLLAPSED: 'browser_sidebar_collapsed' // Add new storage key
};

const createNewTab = (url = 'https://www.google.com', title = 'New Tab') => {
  const tab = {
    id: Date.now().toString(),
    url,
    title,
    isLoading: false,
    history: [url],
    historyIndex: 0,
    historyLimit: 50
  };

  console.log('Created new tab:', tab);
  return tab;
};

const handleTabHistory = (tab, newUrl) => {
  if (tab.url === newUrl) return tab;
  const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), newUrl]
    .slice(-tab.historyLimit);

  return {
    ...tab,
    history: newHistory,
    historyIndex: newHistory.length - 1,
    url: newUrl
  };
};

const InAppBrowser = () => {
  const webviewRef = React.useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  // Initialize theme and layout
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
  );
  const [layout, setLayout] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.LAYOUT) || 'topbar'
  );

  // Add sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return stored ? JSON.parse(stored) : false;
  });

  // Initialize tabs
  const [tabs, setTabs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TABS);
      if (stored) {
        const parsedTabs = JSON.parse(stored);
        return parsedTabs.map(tab => ({
          ...tab,
          history: tab.history || [tab.url],
          historyIndex: tab.historyIndex || 0,
          historyLimit: tab.historyLimit || 50
        }));
      }
      return [createNewTab('https://www.google.com', 'Google')];
    } catch (error) {
      console.error('Error loading tabs from localStorage:', error);
      return [createNewTab('https://www.google.com', 'Google')];
    }
  });

  const [activeTabId, setActiveTabId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || tabs[0]?.id;
    } catch {
      return tabs[0]?.id;
    }
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Save tabs and active tab
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTabId);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [tabs, activeTabId]);

  // Theme effect
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

  // Layout change handler
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

  // Handler for toggling sidebar
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // Navigation handlers
  const handleBack = (tabId) => {
    console.log('Handling back navigation for tab:', tabId);
    setTabs(prev => prev.map(tab => {
      if (tab.id === tabId && tab.historyIndex > 0) {
        const newIndex = tab.historyIndex - 1;
        const newUrl = tab.history[newIndex];
        if (webviewRef.current) {
          webviewRef.current.src = newUrl;
        }
        return {
          ...tab,
          historyIndex: newIndex,
          url: newUrl,
          isLoading: true
        };
      }
      return tab;
    }));
  };

  const handleForward = (tabId) => {
    console.log('Handling forward navigation for tab:', tabId);
    setTabs(prev => prev.map(tab => {
      if (tab.id === tabId && tab.historyIndex < tab.history.length - 1) {
        const newIndex = tab.historyIndex + 1;
        const newUrl = tab.history[newIndex];
        if (webviewRef.current) {
          webviewRef.current.src = newUrl;
        }
        return {
          ...tab,
          historyIndex: newIndex,
          url: newUrl,
          isLoading: true
        };
      }
      return tab;
    }));
  };

  const handleNewTab = () => {
    const newTab = createNewTab();
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
        createNewTab('https://www.google.com', 'Google')
      ];
    });
  };

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
  };

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
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem(STORAGE_KEYS.LAYOUT, newLayout);
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

    const handleNewWindow = (e) => {
      e.preventDefault();
      const newTab = createNewTab(e.url, 'Loading...');
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    };

    const handleWillNavigate = (e) => {
      setTabs(prev => prev.map(tab => {
        if (tab.id === activeTabId) {
          return handleTabHistory(tab, e.url);
        }
        return tab;
      }));
    };

    webviewRef.current.addEventListener('did-start-loading', handleLoadStart);
    webviewRef.current.addEventListener('did-stop-loading', handleLoadStop);
    webviewRef.current.addEventListener('new-window', handleNewWindow);
    webviewRef.current.addEventListener('will-navigate', handleWillNavigate);

    return () => {
      if (webviewRef.current) {
        webviewRef.current.removeEventListener('did-start-loading', handleLoadStart);
        webviewRef.current.removeEventListener('did-stop-loading', handleLoadStop);
        webviewRef.current.removeEventListener('new-window', handleNewWindow);
        webviewRef.current.removeEventListener('will-navigate', handleWillNavigate);
      }
    };
  }, [activeTabId]);

  // Navigation props
  const navigationProps = {
    tabs,
    activeTabId,
    urlInput,
    onUrlSubmit: handleUrlSubmit,
    onUrlChange: setUrlInput,
    onNewTab: handleNewTab,
    onCloseTab: handleCloseTab,
    onTabClick: handleTabClick,
    onSettingsOpen: () => setIsSettingsOpen(true),
    onThemeChange: handleThemeChange,
    onLayoutChange: handleLayoutChange,
    isUrlModalOpen,
    webviewRef,
    setIsUrlModalOpen,
    onBack: handleBack,
    onForward: handleForward,
    activeTab,
    isSidebarCollapsed,
    onToggleSidebar: handleToggleSidebar
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (activeTab) handleBack(activeTab.id);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (activeTab) handleForward(activeTab.id);
            break;
        }
      }

      if (isCmdOrCtrl) {
        switch (e.key) {
          case 't':
            e.preventDefault();
            handleNewTab();
            setIsUrlModalOpen(true);
            break;
          case 'l':
            e.preventDefault();
            setIsUrlModalOpen(true);
            break;
          case 'y':
            e.preventDefault();
            const newLayout = layout === 'topbar' ? 'sidebar' : 'topbar';
            handleLayoutChange(newLayout);
            break;
          case '\\': // Add shortcut for toggling sidebar
            e.preventDefault();
            handleToggleSidebar();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [layout, activeTab, handleToggleSidebar]);

  // Calculate webview container class based on sidebar state
  const getWebviewContainerClass = () => {
    if (layout === 'sidebar') {
      return isSidebarCollapsed 
        ? " w-[calc(100%-3rem)]" 
        : "w-[calc(100%-var(--sidebar-width))]";
    }
    return "";
  };

  return (
    <div data-atlas="Browser" className="h-screen flex relative border-[0.5px] border-foreground/20 rounded-lg  overflow-hidden bg-background backdrop-blur-lg">
      {layout === 'sidebar' ? (
        <div className="flex flex-1 h-full z-10 relative">
          <SideBar {...navigationProps} classname="z-20 relative" />
          <div className={`flex-1 transition-all duration-300 ${getWebviewContainerClass()}`}>
            <div
              className="flex flex-1 w-full items-center px-3"
              style={{ WebkitAppRegion: 'drag' }}
            />
            <div className="flex-1 w-full h-screen rounded-lg overflow-hidden shadow-inner">
              {activeTab && (
                <webview
                  ref={webviewRef}
                  src={activeTab.url}
                  className="bg-white z-0 relative w-full mr-1 max-w-[calc(100%-theme(spacing.1)*2)] h-[calc(100vh-theme(spacing.2)*2)] top-2 rounded-lg overflow-hidden"
                  style={{ zIndex: 1 }}
                  webpreferences="nodeIntegration=false, contextIsolation=true"
                  allowpopups="true"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-between shadow-inner w-full h-full pb-1">
          <TopBar {...navigationProps} className="z-10 relative" />
          <div className="z-20 relative flex-1">
            {activeTab && (
              <webview
                ref={webviewRef}
                src={activeTab.url}
                className="bg-white z-0 relative w-full ml-1 max-w-[calc(100%-theme(spacing.4)/2)] h-full rounded-lg overflow-hidden"
                style={{ zIndex: 1 }}
                webpreferences="nodeIntegration=false, contextIsolation=true"
                allowpopups="true"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InAppBrowser;