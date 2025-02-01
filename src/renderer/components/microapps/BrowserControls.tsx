import React from "react";

import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
const BrowserControls = () => {
  return (
    <div
      className="flex items-center space-x-1 mr-2"
      style={{ WebkitAppRegion: "no-drag" }}>
      <button
        onClick={() => {
          history.back();
        }}
        className="p-1 text-foreground-secondary hover:text-foreground hover:bg-background-secondary">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          history.forward();
        }}
        className="p-1 text-foreground-secondary hover:text-foreground hover:bg-background-secondary">
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          location.reload();
        }}
        className="p-1 text-foreground-secondary hover:text-foreground hover:bg-background-secondary">
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
};

export default BrowserControls;
