import React from "react";
import { Minus, Square, X, ChevronsLeftRight } from "lucide-react";
import { STYLE } from "../../config";

const WindowControls = ({className = ""}) => {
  const handleWindowControl = (action: "minimize" | "maximize" | "close") => {
    console.log("Window control clicked:", action);
    console.log("electronAPI available:", !!window.electronAPI);
    console.log("windowControls available:", !!window.electronAPI?.windowControls);

    if (window.electronAPI?.windowControls) {
      console.log(`Calling ${action}...`);
      window.electronAPI.windowControls[action]().catch((err) => console.error(`Error in ${action}:`, err));
    } else {
      console.error("Window controls not available");
    }
  };

  

  return (
    <div
      data-atlas="WindowControls"
      className={`flex items-center gap-2 mr-2 md:mr-4 ${className}`}
      style={{ WebkitAppRegion: "no-drag" }}>
      <button
        onClick={() => handleWindowControl("close")}
        className={`${STYLE.windowControls.color.close} ${STYLE.windowControls.size} border border-black/20 text-foreground-secondary rounded-full transition-colors flex items-center justify-center`}
        title="Close">
        <X
          strokeWidth={4}
          className="size-2.5 text-black opacity-0 hover:opacity-[0.5]"
        />
      </button>
      <button
        onClick={() => handleWindowControl("minimize")}
        className={`${STYLE.windowControls.color.min} ${STYLE.windowControls.size} border border-black/20 text-foreground-secondary rounded-full transition-colors flex items-center justify-center`}
        title="Minimize">
        <Minus
          strokeWidth={4}
          className="size-2.5 text-black opacity-0 hover:opacity-[0.5]"
        />
      </button>
      <button
        onClick={() => handleWindowControl("maximize")}
        className={`${STYLE.windowControls.color.max} ${STYLE.windowControls.size} border border-black/20 text-foreground-secondary rounded-full transition-colors flex items-center justify-center`}
        title="Maximize">
        <ChevronsLeftRight
          strokeWidth={4}
          className="size-2.5 rotate-[-45deg] text-black opacity-0 hover:opacity-[0.5]"
        />
      </button>
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
