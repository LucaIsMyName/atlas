import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    title: 'Atlas Browser',
    transparent: true,
    backgroundColor: '#00000000', 
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      webviewTag: true,
      allowRunningInsecureContent: false
    },
  });

  if (process.platform === 'win32') {
    const { setWindowEffect } = require('electron-acrylic-window');
    setWindowEffect(mainWindow, {
      effect: 'acrylic',
      useCustomWindowRefreshMethod: true,
    });
  }

  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(false);
  }

  if (isDev) {
    try {
      mainWindow.loadURL('http://localhost:5174'); // Changed from 5175 to 5174
      mainWindow.webContents.openDevTools();
    } catch (e) {
      console.error('Failed to load dev server:', e);
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }
}

app.whenReady().then(createWindow);

// Handle file dialog
ipcMain.handle('show-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Database Files', extensions: ['db', 'sqlite', 'sqlite3', 'sql'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result;
});

// Handle file reading
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    return buffer;
  } catch (error) {
    throw error;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.handle('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  console.log('Main: close called');
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});