import React, { useState, useEffect } from 'react';
import TopBar from '../layout/TopBar';
import SideBar from '../layout/SideBar';
import { formatUrl } from '../utils/urlHelpers';

const STORAGE_KEYS = {
  TABS: 'browser_tabs',
  ACTIVE_TAB: 'browser_active_tab',
  THEME: 'browser_theme',
  LAYOUT: 'browser_layout',
  SIDEBAR_COLLAPSED: 'browser_sidebar_collapsed'
};

const InAppBrowser = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || 'light');
  const [layout, setLayout] = useState(() => localStorage.getItem(STORAGE_KEYS.LAYOUT) || 'topbar');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) || 'false');
  });

  // Initialize tabs using Electron's API
  useEffect(() => {
    const initializeTabs = async () => {
      const savedTabsData = localStorage.getItem(STORAGE_KEYS.TABS);
      const tabsData = savedTabsData ? JSON.parse(savedTabsData) : [{
        id: Date.now().toString(),
        url: 'https://www.google.com',
        title: 'New Tab'
      }];

      const initializedTabs = await Promise.all(tabsData.map(async (tab) => {
        await window.tabAPI.createTab({ tabId: tab.id, url: tab.url });
        return tab;
      }));

      setTabs(initializedTabs);
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || initializedTabs[0].id;
      setActiveTabId(activeId);
      await window.tabAPI.switchTab(activeId);
    };

    initializeTabs();
  }, []);

  // Handle tab events from main process
  useEffect(() => {
    const handleTabLoading = (event) => {
      const { tabId, loading } = event.detail;
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, isLoading: loading } : tab
      ));
    };

    const handleTabTitleUpdate = (event) => {
      const { tabId, title, url } = event.detail;
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, title, url } : tab
      ));
      if (tabId === activeTabId) {
        setUrlInput(url);
      }
    };

    window.addEventListener('tab-loading', handleTabLoading);
    window.addEventListener('tab-title-updated', handleTabTitleUpdate);
    return () => {
      window.removeEventListener('tab-loading', handleTabLoading);
      window.removeEventListener('tab-title-updated', handleTabTitleUpdate);
    };
  }, [activeTabId]);


  // Navigation handlers
  const handleBack = async (tabId) => {
    await window.tabAPI.goBack(tabId);
  };

  const handleForward = async (tabId) => {
    await window.tabAPI.goForward(tabId);
  };

  const handleNewTab = async () => {
    const newTab = {
      id: Date.now().toString(),
      url: 'https://www.google.com',
      title: 'New Tab',
      isLoading: true
    };

    await window.tabAPI.createTab({ tabId: newTab.id, url: newTab.url });
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    await window.tabAPI.switchTab(newTab.id);
  };

  const handleCloseTab = async (tabId, e) => {
    e.stopPropagation();
    await window.tabAPI.closeTab(tabId);

    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (tabId === activeTabId && newTabs.length > 0) {
        const newActiveId = newTabs[newTabs.length - 1].id;
        setActiveTabId(newActiveId);
        window.tabAPI.switchTab(newActiveId);
      }
      return newTabs;
    });
  };

  const handleTabClick = async (tabId) => {
    setActiveTabId(tabId);
    await window.tabAPI.switchTab(tabId);
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    const formattedUrl = formatUrl(urlInput);
    await window.tabAPI.navigateTo({ tabId: activeTabId, url: formattedUrl });
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

  useEffect(() => {
    window.tabAPI.updateLayout(layout, isSidebarCollapsed);
  }, [layout, isSidebarCollapsed]);

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
    setIsUrlModalOpen,
    onBack: handleBack,
    onForward: handleForward,
    activeTab: tabs.find(tab => tab.id === activeTabId),
    isSidebarCollapsed,
    onToggleSidebar: () => setIsSidebarCollapsed(prev => !prev)
  };

  // Keyboard shortcuts
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    
    const handleKeyboard = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (currentTab) handleBack(currentTab.id);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (currentTab) handleForward(currentTab.id);
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
            handleLayoutChange(layout === 'topbar' ? 'sidebar' : 'topbar');
            break;
          case '\\':
            e.preventDefault();
            setIsSidebarCollapsed(prev => !prev);
            break;
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [layout, activeTabId, tabs]);

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
    <div data-atlas="Browser" className="h-screen flex relative border-[0.5px] border-foreground/20 rounded-lg overflow-hidden bg-background backdrop-blur-lg">
      {layout === 'sidebar' ? (
        <div className="flex flex-1 h-full z-10 relative">
          <SideBar {...navigationProps} classname="z-20 relative" />
          <div className={`flex-1 transition-all duration-300 ${getWebviewContainerClass()}`}>
            <div className="flex flex-1 w-full items-center px-3" style={{ WebkitAppRegion: 'drag' }} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-between shadow-inner w-full h-full pb-1">
          <TopBar {...navigationProps} className="z-10 relative" />
        </div>
      )}
    </div>
  );
};

export default InAppBrowser;