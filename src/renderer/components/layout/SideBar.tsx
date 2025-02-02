import React from "react";
import { Plus, X, Settings, Loader2, Search } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import Tab from "./Tab";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { STYLE } from "../../config";
import WindowControls from "./WindowControls";
import BrowserControls from "./BrowserControls";
import SettingsDropdown from "./SettingsDropdown";
import UrlInput from "./UrlInput";
import GradientLayer from "./GradientLayer";

const SideBar = ({ className, tabs, activeTabId, urlInput, onUrlSubmit, onUrlChange, onNewTab, onCloseTab, onTabClick, onSettingsOpen, onLayoutChange, onThemeChange }) => {
  const handleWindowControl = (action: "minimize" | "maximize" | "close") => {
    if (window.electronAPI?.windowControls?.[action]) {
      window.electronAPI.windowControls[action]();
    }
  };
  return (
    <div className={`w-64 h-full flex flex-col ${className}`}>
      <div className="w-64 p-0">
        <div className="flex items-center justify-between p-4">
          <WindowControls />
          <BrowserControls />
        </div>
        <div className="">
          <div className="mt-2 mx-2">
            <UrlInput
              onUrlSubmit={onUrlSubmit}
              urlInput={urlInput}
              onUrlChange={onUrlChange}
              className="w-full"
            />
          </div>
          <div className="px-2 w-full">
            <hr className="mt-4 mb-2 h-0 border-t w-full block opacity-10" />
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
                  ${STYLE.tab} w-full relative
                  ${activeTabId === tab.id ? " text-background bg-foreground/90 shadow-sm" : "text-foreground-secondary "}
                `}>
            <GradientLayer className="" />
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
              className="opacity-50 group-hover:opacity-100 hover:text-foreground/90 hover:bg-background/90 rounded p-0.5">
              <X className="w-3 h-3" />
            </button>
          </section>
        ))}
      </div>

      {/* New Tab Button & Settings */}
      <div className="p-2 flex items-center justify-between gap-4">
        <button
          onClick={onNewTab}
          className={`flex relative ${STYLE.tab} w-full text-left`}>
          <GradientLayer className="" />
          <Plus className="w-4 h-4" />
          <div className="text-sm flex-1">New Tab</div>
        </button>
        <div className="">
          {/* Settings Button with Dropdown */}
          <SettingsDropdown
            onLayoutChange={onLayoutChange}
            onThemeChange={onThemeChange}>
            <button className="ml-1 p-1.5 rounded text-foreground">
              <Settings className="w-4 h-4" />
            </button>
          </SettingsDropdown>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
