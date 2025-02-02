// UrlInput.jsx
import React from "react";
import { Search } from "lucide-react";
import { STYLE } from "../../config";
import GradientLayer from "./GradientLayer";

const UrlInput = ({ onUrlSubmit, urlInput, onUrlChange, className = "" }) => {
  return (
    <div 
      className={`${STYLE.tab} relative !px-2 !py-1.5 bg-background/30 ${className}`}
      style={{ WebkitAppRegion: "no-drag" }}
    >
      <GradientLayer />
      <Search className="w-4 h-4 opacity-50 text-foreground-secondary flex-shrink-0" />
      <form
        onSubmit={onUrlSubmit}
        className="flex-1 text-xs">
        <input
          type="text"
          value={urlInput}
          onClick={(e) => e.target.select()}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-foreground/60 focus:text-foreground truncate"
          placeholder="Search or enter URL"
        />
      </form>
    </div>
  );
};

export default UrlInput;