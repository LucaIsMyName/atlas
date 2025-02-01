import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs/promises';

// Expose one single API object
contextBridge.exposeInMainWorld('electronAPI', {
  windowControls: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
  },
  readFile: async (filePath) => {
    try {
      const buffer = await fs.readFile(filePath);
      return buffer.buffer;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  },
  showFileDialog: () => ipcRenderer.invoke('show-file-dialog')
});