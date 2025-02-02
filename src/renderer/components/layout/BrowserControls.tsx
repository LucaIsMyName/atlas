import React from "react";

import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
const BrowserControls = () => {
  return (
    <div
      className="flex items-center space-x-1"
      style={{ WebkitAppRegion: "no-drag" }}>
      <button
        onClick={() => {
          history.back();
        }}
        className="p-1  hover:text-foreground/90">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          history.forward();
        }}
        className="p-1 hover:text-foreground/90">
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          location.reload();
        }}
        className="p-1 hover:text-foreground/90">
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
};

export default BrowserControls;
