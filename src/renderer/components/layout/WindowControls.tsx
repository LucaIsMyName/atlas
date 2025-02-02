import React from "react";
import { Minus, Square, X } from "lucide-react";

const WindowControls = () => {
  const handleWindowControl = (action: "minimize" | "maximize" | "close") => {
    console.log('Window control clicked:', action);
    console.log('electronAPI available:', !!window.electronAPI);
    console.log('windowControls available:', !!window.electronAPI?.windowControls);
    
    if (window.electronAPI?.windowControls) {
      console.log(`Calling ${action}...`);
      window.electronAPI.windowControls[action]()
        .catch(err => console.error(`Error in ${action}:`, err));
    } else {
      console.error('Window controls not available');
    }
  };

  return (
    <div
      className="flex items-center gap-2 mr-6"
      style={{ WebkitAppRegion: "no-drag" }}>
      <button
        onClick={() => handleWindowControl("close")}
        className="size-3.5 border border-black/20 text-foreground-secondary bg-red-400 hover:bg-red-600 rounded-full transition-colors"
        title="Close"></button>
      <button
        onClick={() => handleWindowControl("minimize")}
        className="size-3.5 border border-black/20 text-foreground-secondary bg-yellow-500 hover:bg-yellow-600 rounded-full transition-colors"
        title="Minimize"></button>
      <button
        onClick={() => handleWindowControl("maximize")}
        className="size-3.5 border border-black/20 text-foreground-secondary bg-green-500 hover:bg-green-600 rounded-full transition-colors"
        title="Maximize"></button>
    </div>
  );
};

// Add TypeScript declaration for the window API
declare global {
  interface Window {
    electronAPI?: {
      windowControls: {
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
      };
    };
  }
}

export default WindowControls;