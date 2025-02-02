import React from "react";
import { Plus, X, Settings, Loader2, Search } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import { motion, AnimatePresence } from "framer-motion";
import Tab from "./Tab";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { STYLE } from "../../config";
import WindowControls from "./WindowControls";
import BrowserControls from "./BrowserControls";
import SettingsDropdown from "./SettingsDropdown";
import UrlInput from "./UrlInput";
import GradientLayer from "./GradientLayer";

const SideBar = ({
  className,
  tabs,
  activeTabId,
  urlInput,
  onUrlSubmit,
  onUrlChange,
  onNewTab,
  onCloseTab,
  onTabClick,
  onSettingsOpen,
  onLayoutChange,
  onThemeChange,
  isUrlModalOpen, // Add these two props
  setIsUrlModalOpen, // Add these two props
  webviewRef,
}) => {
  return (
    <div data-atlas="SideBar" className={`w-[clamp(240px,30vw,480px)] h-full flex flex-col ${className}`}>
      <div className=" p-0">
        <div className="flex items-center justify-between p-4">
          <WindowControls />
          <BrowserControls
            activeTab={activeTabId ? tabs.find((tab) => tab.id === activeTabId) : ""}
            onBack={() => webviewRef.current.goBack()}
            onForward={() => webviewRef.current.goForward()}
            webviewRef={webviewRef}
          />
        </div>
        <div className="mx-2">
          <div className="w-full">
            <UrlInput
              onUrlSubmit={onUrlSubmit}
              urlInput={urlInput}
              onUrlChange={onUrlChange}
              isOpen={isUrlModalOpen}
              setIsUrlModalOpen={setIsUrlModalOpen} // Pass the setter instead of onClose
              className="block w-full"
            />
          </div>
          <div className="w-full">
            <hr className="mt-4 mb-2 h-0 border-t w-full block opacity-10" />
          </div>
        </div>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => (
            <motion.section
              key={tab.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1,
                height: {
                  duration: 0.2,
                },
              }}
              onClick={() => onTabClick(tab.id)}
              className={`
          ${STYLE.tab} w-full relative overflow-hidden truncate justify-between
          ${activeTabId === tab.id ? " text-background bg-foreground/90 shadow-sm" : "text-foreground-secondary "}
        `}>
              <GradientLayer />
              <motion.div
                className="flex items-center justify-between w-full gap-2"
                layout>
                <div className="w-4 h-4">
                  {tab.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  ) : (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={getFaviconUrl(tab.url)}
                      className="w-4 h-4"
                    />
                  )}
                </div>
                <motion.span
                  layout
                  className="truncate block text-sm flex-1 w-full">
                  {tab.title || "New Tab"}
                </motion.span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => onCloseTab(tab.id, e)}
                  className="opacity-50 group-hover:opacity-100 hover:text-foreground/90 hover:bg-background/90 rounded p-0.5">
                  <X className="w-3 h-3" />
                </motion.button>
              </motion.div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>
      {/* New Tab Button & Settings */}
      <div className="p-2 flex items-center justify-between gap-4">
        <button
          onClick={onNewTab}
          className={`flex relative ${STYLE.tab} w-full text-left`}>
          <GradientLayer />
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
