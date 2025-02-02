// UrlInput.tsx
import React, { useState } from "react";
import { X, Shield, ShieldAlert } from "lucide-react";
import { STYLE } from "../../config";
import GradientLayer from "./GradientLayer";

const UrlModal = ({ isOpen, onClose, urlInput, onUrlChange, onUrlSubmit }) => {
  if (!isOpen) return null;
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      data-atlas="UrlModal"
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className={`relative w-full max-w-2xl mx-4 rounded-lg border-2 border-background shadow-xl p-4 overflow-hidden !block`}>
        <GradientLayer />
        <div className="relative z-10">
          <div className=" hidden justify-between items-center mb-4">
            <h3 className="text-3xl font-medium">Enter URL</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-background-secondary rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form
            className="text-3xl"
            onSubmit={(e) => {
              e.preventDefault();
              onUrlSubmit(e);
              onClose();
            }}>
            <input
              autoFocus
              type="text"
              value={urlInput}
              onFocus={(e) => e.target.setSelectionRange(0, e.target.value.length)}
              onClick={(e) => e.target.setSelectionRange(0, e.target.value.length)}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full outline-none bg-transparent"
              placeholder="Search or enter URL"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

// UrlInput.tsx
const UrlInput = ({ onUrlSubmit, urlInput, onUrlChange, className = "", isOpen = false, setIsUrlModalOpen }) => {
  function formatedUrlInput(urlInput) {
    // take the url and  delete the https:// or http:// and the part after the TLD
    // e.g. https://www.google.com/search?q=hello -> google.com
    let url = urlInput.replace(/(^\w+:|^)\/\//, "").split("/")[0];
    return url;
  }

  return (
    <>
      <button
        data-atlas="UrlInput"
        onClick={() => setIsUrlModalOpen(true)} // Changed from onClose(true)
        className={`${STYLE.tab} relative block w-full !px-2 !py-1.5 bg-background/30 ${className}`}
        style={{ WebkitAppRegion: "no-drag" }}>
        <GradientLayer />
        {urlInput.startsWith("https") ? <Shield className="w-4 h-4 opacity-50 text-foreground-secondary flex-shrink-0" /> : <ShieldAlert className="w-4 h-4 opacity-50 text-foreground-secondary flex-shrink-0" />}
        <span className="text-sm text-foreground/60 truncate block">{formatedUrlInput(urlInput) || "Search or enter URL"}</span>
      </button>

      <UrlModal
        isOpen={isOpen}
        onClose={() => setIsUrlModalOpen(false)}
        urlInput={urlInput}
        onUrlChange={onUrlChange}
        onUrlSubmit={onUrlSubmit}
      />
    </>
  );
};

export default UrlInput;
