import React from "react";
import { Plus, X, Settings, Loader2, Search, GripHorizontal } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import { motion, AnimatePresence } from "framer-motion";
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
    <div
      data-atlas="SideBar"
      className={`w-[clamp(280px,30vw,420px)] h-full flex flex-col ${className}`}
      style={{
        WebkitAppRegion: "drag",
      }}>
      <div className=" p-0">
        <div className="flex items-center justify-between p-4">
          <WindowControls className="" />
          <BrowserControls
            activeTab={activeTabId ? tabs.find((tab) => tab.id === activeTabId) : ""}
            onBack={() => webviewRef.current.goBack()}
            onForward={() => webviewRef.current.goForward()}
            webviewRef={webviewRef}
          />
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
            <hr className=" h-0 border-t w-full block opacity-10" />
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
                       w-full relative ${STYLE.tab.default} justify-between
                      ${activeTabId === tab.id ? `shadow-sm border-foreground/50` : `opacity-[0.95] hover:opacity-[1] text-foreground-secondary `}
                    `}>
              {activeTabId ? (
                <></>
              ) : (
                <>
                  <GradientLayer />
                  <GradientLayer />
                </>
              )}
              <motion.div
                className="flex items-center justify-between w-full gap-2"
                layout>
                <div className={`${STYLE.browserControls.size} flex items-center justify-between`}>
                  {tab.isLoading ? (
                    <Loader2 className="w-4 h-4  animate-spin flex-shrink-0" />
                  ) : (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={getFaviconUrl(tab.url)}
                      className={`${STYLE.tab.favicon.size}`}
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
      <div
        className="p-2 flex items-center justify-between gap-4"
        style={{
          WebkitAppRegion: "no-drag",
        }}>
        <button
          onClick={onNewTab}
          className={`flex relative ${STYLE.tab.default} dark:bg-sky-900 bg-sky-500 text-background dark:text-foreground  w-full text-left`}>
          <GradientLayer className="opacity-[0.02] mix-blend-multiply" />
          <Plus className={`relative z-10${STYLE.browserControls.size}`} />
          <div className=" relative z-10 text-sm flex-1">New Tab</div>
        </button>
        <div className=" mr-4">
          {/* Settings Button with Dropdown */}
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
    </div>
  );
};

export default SideBar;
