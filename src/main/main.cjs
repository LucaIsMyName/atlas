const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    title: 'Atlas Browser',
    transparent: true,
    backgroundColor: '#00000000',
    trafficLightPosition: { x: -100, y: -100 },
    vibrancy: 'under-window',
    titleBarOverlay: "hiddenInset",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, isDev ? '../../src/main/preload.cjs' : './preload.cjs'),
      webSecurity: true,
      webviewTag: true,
      allowRunningInsecureContent: false,
      sandbox: false
    },
  });

  // Set CSP
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval' data: http: https:"]
      }
    });
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  return mainWindow;
}

// Initialize app
app.whenReady().then(() => {
  console.log('App is ready, creating window...');
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

// Window control handlers
ipcMain.handle('window-minimize', () => {
  console.log('Minimize requested');
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.minimize();
    return true;
  }
  return false;
});

ipcMain.handle('window-maximize', () => {
  console.log('Maximize requested');
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
    return true;
  }
  return false;
});

ipcMain.handle('window-close', () => {
  console.log('Close requested');
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.close();
    return true;
  }
  return false;
});

ipcMain.handle('get-env-variable', (event, key) => {
  return process.env[key];
});