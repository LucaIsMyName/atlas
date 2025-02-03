import React from "react";
import { Plus, X, Settings, Loader2, Search, GripHorizontal, PanelLeftClose, PanelLeft } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { STYLE } from "../../config";
import WindowControls from "./WindowControls";
import BrowserControls from "./BrowserControls";
import SettingsDropdown from "./SettingsDropdown";
import UrlInput from "./UrlInput";
import GradientLayer from "./GradientLayer";

const SideBar = ({ className, tabs, activeTabId, urlInput, onUrlSubmit, onUrlChange, onNewTab, onCloseTab, onTabClick, onSettingsOpen, onLayoutChange, onThemeChange, isUrlModalOpen, setIsUrlModalOpen, webviewRef, isSidebarCollapsed, onToggleSidebar }) => {
  if (isSidebarCollapsed) {
    return (
      <motion.div
        initial={{ width: "var(--sidebar-width)" }}
        animate={{ width: "auto" }}
        transition={{ duration: 0.2 }}
        exit={{ width: "var(--sidebar-width)" }}
        className="h-full flex flex-col items-center py-4 border-r border-background/20 bg-background"
        style={{ WebkitAppRegion: "drag" }}>
        {/* Only show toggle button when collapsed */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:text-foreground/90 mb-4"
          style={{ WebkitAppRegion: "no-drag" }}
          title="Expand Sidebar">
          <PanelLeft
            strokeWidth={STYLE.browserControls.strokeWidth}
            className={`${STYLE.browserControls.size}`}
          />
        </button>

        {/* Collapsed tab indicators */}
        <div className="flex-1 w-full mt-2 px-2">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`w-8 h-8 mb-2  rounded-md overflow-hidden flex items-center justify-center border  ${activeTabId === tab.id ? `shadow-sm border-foreground/50 ${STYLE.color.bg.primary} text-background dark:text-foreground` : `border-foreground/30 opacity-[0.95] hover:opacity-[1] text-foreground-secondary`}`}
              style={{ WebkitAppRegion: "no-drag" }}>
              {tab.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <img
                  src={getFaviconUrl(tab.url)}
                  className="w-4 h-4 object-contain"
                  alt={tab.title}
                />
              )}
            </motion.div>
          ))}
        </div>
        {/* New Tab Button & Settings */}
        <div
          className="flex flex-col items-center justify-between gap-4"
          style={{
            WebkitAppRegion: "no-drag",
          }}>
          <button
            onClick={onNewTab}
            className={`flex justify-center items-center rounded-lg border ${STYLE.color.bg.primary} w-8 h-8 text-background dark:text-foreground w-full text-center `}>
            <Plus className={` ${STYLE.browserControls.size}`} />
          </button>
          <div className="">
            <SettingsDropdown
              onLayoutChange={onLayoutChange}
              onThemeChange={onThemeChange}>
              <button className="ml-1 p-1.5 rounded text-foreground">
                <Settings
                  strokeWidth={STYLE.browserControls.strokeWidth}
                  className={`${STYLE.browserControls.size}`}
                />
              </button>
            </SettingsDropdown>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-atlas="SideBar"
      initial={{ width: "auto" }}
      animate={{ width: "var(--sidebar-width)" }}
      exit={{ width: "auto" }}
      transition={{ duration: 0.5 }}
      className={`h-full flex flex-col ${className}`}
      style={{
        WebkitAppRegion: "drag",
      }}>
      <div className="p-0">
        <div className="flex items-center justify-between p-4">
          <WindowControls className="" />
          <div className="flex items-center gap-1">
            <BrowserControls
              activeTab={activeTabId ? tabs.find((tab) => tab.id === activeTabId) : null}
              onBack={() => webviewRef.current?.goBack()}
              onForward={() => webviewRef.current?.goForward()}
              webviewRef={webviewRef}
            />
            {/* Collapse button without border */}
            <button
              onClick={onToggleSidebar}
              className="p-1 hover:text-foreground/90"
              style={{ WebkitAppRegion: "no-drag" }}
              title="Collapse Sidebar">
              <PanelLeftClose
                strokeWidth={STYLE.browserControls.strokeWidth}
                className={`${STYLE.browserControls.size}`}
              />
            </button>
          </div>
        </div>
        <div className="mx-2">
          <div
            className="w-full"
            style={{
              WebkitAppRegion: "no-drag",
            }}>
            <UrlInput
              onUrlSubmit={onUrlSubmit}
              urlInput={urlInput}
              onUrlChange={onUrlChange}
              isOpen={isUrlModalOpen}
              setIsUrlModalOpen={setIsUrlModalOpen}
              className="block w-full"
            />
          </div>
          <div
            style={{
              WebkitAppRegion: "drag",
            }}
            className="w-full flex gap-4 items-center mt-2 mb-0 cursor-grab">
            <hr className="h-0 border-t w-full block opacity-10" />
            <div>
              <GripHorizontal className="size-4 opacity-30" />
            </div>
            <hr className="h-0 border-t w-full block opacity-10" />
          </div>
        </div>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => (
            <motion.section
              style={{
                WebkitAppRegion: "no-drag",
              }}
              key={tab.id}
              initial={{ opacity: 0, x: -20, height: "auto" }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: -20, height: "auto" }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1,
              }}
              onClick={() => onTabClick(tab.id)}
              className={`
                w-full relative ${STYLE.tab.default} justify-between
                ${activeTabId === tab.id ? `shadow-sm border-foreground/50 ${STYLE.color.bg.primary} text-background dark:text-foreground` : `opacity-[0.95] hover:opacity-[1] text-foreground-secondary`}
              `}>
              <motion.div
                className="flex items-center justify-between w-full gap-2"
                layout>
                <div className={`${STYLE.browserControls.size} flex items-center justify-between`}>
                  {tab.isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0 }}>
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    </motion.div>
                  ) : (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0 }}
                      src={getFaviconUrl(tab.url)}
                      className={`${STYLE.tab.favicon.size}`}
                    />
                  )}
                </div>
                <motion.span
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: 0 }}
                  className="truncate block text-sm flex-1 w-full">
                  {tab.title || "New Tab"}
                </motion.span>
                <motion.button
                  onClick={(e) => onCloseTab(tab.id, e)}
                  className="opacity-50 rounded p-0.5">
                  <X className="w-3 h-3" />
                </motion.button>
              </motion.div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>

      {/* New Tab Button & Settings */}
      <div
        className="p-2 flex items-center justify-between gap-4"
        style={{
          WebkitAppRegion: "no-drag",
        }}>
        <button
          onClick={onNewTab}
          className={`flex ${STYLE.tab.default} ${STYLE.color.bg.primary} text-background dark:text-foreground w-full text-left`}>
          <Plus className={`relative z-10${STYLE.browserControls.size}`} />
          <div className="relative z-10 text-sm flex-1">New Tab</div>
        </button>
        <div className="mr-4">
          <SettingsDropdown
            onLayoutChange={onLayoutChange}
            onThemeChange={onThemeChange}>
            <button className="ml-1 p-1.5 rounded text-foreground">
              <Settings
                strokeWidth={STYLE.browserControls.strokeWidth}
                className={`${STYLE.browserControls.size}`}
              />
            </button>
          </SettingsDropdown>
        </div>
      </div>
    </motion.div>
  );
};

export default SideBar;
