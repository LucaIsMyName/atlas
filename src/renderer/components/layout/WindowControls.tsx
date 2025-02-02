import React from "react";
import { Minus, Square, X } from "lucide-react";

const WindowControls = () => {
  const handleWindowControl = (action: "minimize" | "maximize" | "close") => {
    if (window.electronAPI?.windowControls) {
      window.electronAPI.windowControls[action]();
    }
  };

  return (
    <div
      className="flex items-center gap-2 mr-6"
      style={{ WebkitAppRegion: "no-drag" }}>
      <button
        onClick={() => handleWindowControl("close")}
        className="size-4 border border-black/20 text-foreground-secondary bg-red-400 hover:bg-red-600 rounded-full transition-colors"
        title="Close"></button>
      <button
        onClick={() => handleWindowControl("minimize")}
        className="size-4 border border-black/20 text-foreground-secondary bg-yellow-500 hover:bg-yellow-600 rounded-full transition-colors"
        title="Minimize"></button>
      <button
        onClick={() => handleWindowControl("maximize")}
        className="size-4 border border-black/20 text-foreground-secondary bg-green-500 hover:bg-green-600 rounded-full transition-colors"
        title="Maximize"></button>
    </div>
  );
};

export default WindowControls;
