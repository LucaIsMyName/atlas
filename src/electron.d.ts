export {};

declare global {
  interface Window {
    electronAPI: {
      windowControls: {
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
      };
    };
  }
}