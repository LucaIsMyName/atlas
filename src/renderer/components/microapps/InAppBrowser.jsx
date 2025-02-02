import React, { useState, useEffect } from 'react';
import TopBar from '../layout/TopBar';
import SideBar from '../layout/SideBar';
import { formatUrl } from '../utils/urlHelpers';
import GradientLayer from '../layout/GradientLayer';

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
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  // Initialize theme and layout first
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
  );
  const [layout, setLayout] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.LAYOUT) || 'topbar'
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

    // Handle new window requests (e.g., target="_blank")
    const handleNewWindow = (e) => {
      e.preventDefault();
      const newTab = {
        id: Date.now().toString(),
        url: e.url,
        title: 'Loading...',
        isLoading: true
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    };

    // Handle regular navigation within the tab
    const handleWillNavigate = (e) => {
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId ? { ...tab, url: e.url, isLoading: true } : tab
      ));
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
    onSettingsOpen: () => setIsSettingsOpen(true),
    onThemeChange: handleThemeChange,
    onLayoutChange: handleLayoutChange,
    isUrlModalOpen,
    webviewRef,
    setIsUrlModalOpen
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl) {
        switch (e.key) {
          case 't':
            e.preventDefault();
            handleNewTab();
            setIsUrlModalOpen(true);
            break;
          case 'l':
            e.preventDefault();
            setIsUrlModalOpen(true); // Add this to open URL input on Cmd+L
            break;
          case 'y':
            e.preventDefault();
            const newLayout = layout === 'topbar' ? 'sidebar' : 'topbar';
            handleLayoutChange(newLayout);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [layout, handleNewTab, setIsUrlModalOpen, handleLayoutChange]); // Add all dependencies

  return (
    <div className="h-screen flex relative border-[0.5px] border-background/20 rounded-[10px] overflow-hidden">
      <GradientLayer />
      <GradientLayer />
      {/* Layout Selection */}
      {layout === 'sidebar' ? (
        <div className="flex flex-1 h-full z-10 relative">
          <SideBar {...navigationProps} classname="z-20 relative" />
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
                className="bg-white z-0 relative w-full ml-1 max-w-[calc(100%-theme(spacing.4)/2)] h-[calc(100vh-theme(spacing.1)*2)] top-1 rounded-lg overflow-hidden"
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
          <div className="z-20 relative flex-1  ">
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

      {/* Settings Modal */}
      {/* <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLayoutChange={handleLayoutChange}
        onThemeChange={handleThemeChange}
      /> */}
    </div>
  );
};

export default InAppBrowser;