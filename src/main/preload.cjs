const { contextBridge, ipcRenderer } = require('electron');

const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[Preload]:', ...args);
}

log('Preload script starting...');

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    windowControls: {
      minimize: async () => {
        log('Minimize requested');
        return await ipcRenderer.invoke('window-minimize');
      },
      maximize: async () => {
        log('Maximize requested');
        return await ipcRenderer.invoke('window-maximize');
      },
      close: async () => {
        log('Close requested');
        return await ipcRenderer.invoke('window-close');
      }
    }
  });
  
  log('APIs exposed successfully:', {
    windowControls: true
  });
} catch (error) {
  console.error('Error in preload script:', error);
}