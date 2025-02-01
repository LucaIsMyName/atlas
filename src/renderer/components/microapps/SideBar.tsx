import React from "react";
import { Plus, X, Settings, Loader2, Search } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import Tab from "./Tab";
import { STYLE } from "../../config";

const SideBar = ({ tabs, activeTabId, urlInput, onUrlSubmit, onUrlChange, onNewTab, onCloseTab, onTabClick, onSettingsOpen }) => {
  return (
    <div className="w-64 h-full bg-background flex flex-col ">
      <div className="w-64 p-4 pb-0">
        <div
          className="flex items-center space-x-2"
          style={{ WebkitAppRegion: "no-drag" }}>
          <button
            onClick={() => window.electronAPI.windowControls.close()}
            className="w-3 h-3 size-3 rounded-full bg-red-500 hover:bg-red-600"
          />
          <button
            onClick={() => window.electronAPI.windowControls.minimize()}
            className="w-3 h-3 size-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
          />
          <button
            onClick={() => window.electronAPI.windowControls.maximize()}
            className="w-3 h-3 size-3 rounded-full bg-green-500 hover:bg-green-600"
          />
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
                onChange={(e) => onUrlChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-foreground-primary truncate"
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
      <div className="p-2 border-t border-background-secondary flex items-center justify-between gap-4">
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
