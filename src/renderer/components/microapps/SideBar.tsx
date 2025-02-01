import React from "react";
import { Plus, X, Settings, Loader2, Search } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import Tab from "./Tab";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { STYLE } from "../../config";
import WindowControls from "./WindowControls";
import BrowserControls from "./BrowserControls";

const SideBar = ({ tabs, activeTabId, urlInput, onUrlSubmit, onUrlChange, onNewTab, onCloseTab, onTabClick, onSettingsOpen }) => {
  const handleWindowControl = (action: "minimize" | "maximize" | "close") => {
    if (window.electronAPI?.windowControls?.[action]) {
      window.electronAPI.windowControls[action]();
    }
  };
  return (
    <div className="w-64 h-full bg-background flex flex-col ">
      <div className="w-64 p-4 pr-0 pb-0">
        <div className="flex items-center justify-between">
          <WindowControls />
          <BrowserControls />
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 py-1.5 bg-background-primary rounded">
            <Search className="w-4 h-4 text-foreground-secondary" />
            <form
              onSubmit={onUrlSubmit}
              className="">
              <input
                type="text"
                value={urlInput}
                onClick={(e) => e.target.select()}
                onChange={(e) => onUrlChange(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-foreground truncate"
                placeholder="Search or enter URL"
              />
            </form>
          </div>
        </div>
      </div>
      {/* URL Input */}

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {tabs.map((tab) => (
          <section
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`
                  ${STYLE.tab} w-full
                  ${activeTabId === tab.id ? " text-foreground bg-background-secondary shadow-sm" : "text-foreground-secondary hover:bg-background/50 "}
                `}>
            <div className="w-4 h-4">
              {tab.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              ) : (
                <img
                  src={getFaviconUrl(tab.url)}
                  className={`w-4 h-4`}
                />
              )}
            </div>
            <span className="truncate text-sm flex-1">{tab.title || "New Tab"}</span>
            <button
              onClick={(e) => onCloseTab(tab.id, e)}
              className="opacity-50 group-hover:opacity-100 hover:bg-background-secondary rounded p-0.5">
              <X className="w-3 h-3" />
            </button>
          </section>
        ))}
      </div>

      {/* New Tab Button & Settings */}
      <div className="p-2 flex items-center justify-between gap-4">
        <button
          onClick={onNewTab}
          className="flex text-left w-full items-center gap-2 px-3 rounded border border-foreground-secondary shadow py-2 w-full rounded hover:bg-background-primary/50 text-foreground-secondary">
          <Plus className="w-4 h-4" />
          <div className="text-sm flex-1">New Tab</div>
        </button>
        <div className="">
          <button
            onClick={onSettingsOpen}
            className="flex shrink-1 items-center gap-2 px-3 py-2 w-full rounded hover:bg-background-primary/50 text-foreground-secondary">
            <Settings className="w-4 h-4" />
            <span className="text-sm hidden">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
