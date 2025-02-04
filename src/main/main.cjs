const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';

// Track tabs and views
const tabViews = new Map();
let mainWindow;

function resolveHybridPath(relativePath) {
  return isDev 
    ? path.join(__dirname, relativePath)
    : path.join(process.resourcesPath, 'app.asar/dist/main', relativePath);
}

// In main.cjs:
let currentLayout = 'topbar';
let isSidebarCollapsed = false;
const SIDEBAR_WIDTH = 280; // Match your CSS var(--sidebar-width)
const TOPBAR_HEIGHT = 80;
const COLLAPSED_SIDEBAR_WIDTH = 48; // Width when showing only icons

function calculateViewBounds() {
  const bounds = mainWindow.getBounds();
  
  if (currentLayout === 'sidebar') {
    return {
      x: isSidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
      y: 0,
      width: bounds.width - (isSidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH),
      height: bounds.height
    };
  }

  return {
    x: 0,
    y: TOPBAR_HEIGHT,
    width: bounds.width,
    height: bounds.height - TOPBAR_HEIGHT
  };
}



function createBrowserView(tabId, url) {
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      sandbox: true
    }
  });

  mainWindow.addBrowserView(view);
  view.setBounds(calculateViewBounds());
  view.webContents.loadURL(url);
  
  // Handle navigation events
  view.webContents.on('did-start-loading', () => {
    mainWindow.webContents.send('tab-loading', { tabId, loading: true });
  });

  view.webContents.on('did-stop-loading', () => {
    mainWindow.webContents.send('tab-loading', { tabId, loading: false });
    mainWindow.webContents.send('tab-title-updated', {
      tabId,
      title: view.webContents.getTitle(),
      url: view.webContents.getURL()
    });
  });

  view.webContents.on('page-title-updated', (event, title) => {
    mainWindow.webContents.send('tab-title-updated', {
      tabId,
      title,
      url: view.webContents.getURL()
    });
  });

  tabViews.set(tabId, view);
  return view;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true,
    titleBarStyle: 'hidden',
    transparent: true,
    backgroundColor: '#00000000',
    trafficLightPosition: { x: -100, y: -100 },
    vibrancy: 'under-window',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: resolveHybridPath('preload.cjs'),
      webSecurity: true,
      sandbox: false
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  mainWindow.on('resize', () => {
    // Update all view bounds when window is resized
    tabViews.forEach(view => {
      view.setBounds(calculateViewBounds());
    });
  });

  return mainWindow;
}

// Tab Management IPC Handlers
ipcMain.handle('create-tab', async (event, { tabId, url }) => {
  createBrowserView(tabId, url || 'https://www.google.com');
});

ipcMain.handle('switch-tab', async (event, tabId) => {
  tabViews.forEach((view, id) => {
    if (id === tabId) {
      view.webContents.setBackgroundThrottling(false);
      mainWindow.setTopBrowserView(view);
    } else {
      view.webContents.setBackgroundThrottling(true);
    }
  });
});

ipcMain.handle('close-tab', async (event, tabId) => {
  const view = tabViews.get(tabId);
  if (view) {
    mainWindow.removeBrowserView(view);
    view.webContents.destroy();
    tabViews.delete(tabId);
  }
});

// Navigation Handlers
ipcMain.handle('go-back', async (event, tabId) => {
  const view = tabViews.get(tabId);
  if (view?.webContents.canGoBack()) {
    view.webContents.goBack();
    return true;
  }
  return false;
});

ipcMain.handle('go-forward', async (event, tabId) => {
  const view = tabViews.get(tabId);
  if (view?.webContents.canGoForward()) {
    view.webContents.goForward();
    return true;
  }
  return false;
});

ipcMain.handle('navigate-to', async (event, { tabId, url }) => {
  const view = tabViews.get(tabId);
  if (view) {
    await view.webContents.loadURL(url);
    return true;
  }
  return false;
});

// Window Controls
ipcMain.handle('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
    return true;
  }
  return false;
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return true;
  }
  return false;
});

ipcMain.handle('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
    return true;
  }
  return false;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-env-variable', (event, key) => {
  return process.env[key];
});

// Add IPC handlers
ipcMain.handle('update-layout', (event, layout, collapsed = false) => {
  currentLayout = layout;
  isSidebarCollapsed = collapsed;
  
  const view = tabViews.get(activeTabId);
  if (view) {
    view.setBounds(calculateViewBounds());
  }
});