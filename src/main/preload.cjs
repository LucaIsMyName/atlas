const { contextBridge, ipcRenderer } = require('electron');

const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[Preload]:', ...args);
}

log('Preload script starting...');

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    windowControls: {
      minimize: () => ipcRenderer.invoke('window-minimize'),
      maximize: () => ipcRenderer.invoke('window-maximize'),
      close: () => ipcRenderer.invoke('window-close')
    },
    getEnvVariable: (key) => ipcRenderer.invoke('get-env-variable', key),
  });

  contextBridge.exposeInMainWorld('tabAPI', {
    createTab: (tabInfo) => ipcRenderer.invoke('create-tab', tabInfo),
    switchTab: (tabId) => ipcRenderer.invoke('switch-tab', tabId),
    closeTab: (tabId) => ipcRenderer.invoke('close-tab', tabId),
    goBack: (tabId) => ipcRenderer.invoke('go-back', tabId),
    goForward: (tabId) => ipcRenderer.invoke('go-forward', tabId),
    navigateTo: (tabInfo) => ipcRenderer.invoke('navigate-to', tabInfo),
    updateLayout: (layout, collapsed) => ipcRenderer.invoke('update-layout', layout, collapsed)

  });

  // Listen for tab events
  ipcRenderer.on('tab-loading', (event, data) => {
    window.dispatchEvent(new CustomEvent('tab-loading', { detail: data }));
  });

  ipcRenderer.on('tab-title-updated', (event, data) => {
    window.dispatchEvent(new CustomEvent('tab-title-updated', { detail: data }));
  });

  

  log('APIs exposed successfully');
  
} catch (error) {
  console.error('Error in preload script:', error);
}