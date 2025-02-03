import React, { useState } from "react"; // Add useState import
import { Plus, X, Loader2, RefreshCw, ArrowLeft, ArrowRight, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { STYLE } from "../../config";
import WindowControls from "./WindowControls";
import SettingsDropdown from "./SettingsDropdown";
import "swiper/css";
import "swiper/css/free-mode";
import BrowserControls from "./BrowserControls";
import UrlInput from "./UrlInput";
import GradientLayer from "./GradientLayer";

const TopBar = ({
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
  onThemeChange,
  onLayoutChange,
  isUrlModalOpen, // Add these two props
  setIsUrlModalOpen, // Add these two props
  webviewRef,
}) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div
      data-atlas="TopBar"
      className="relative flex items-center justify-between px-2 w-full"
      style={{
        WebkitAppRegion: "drag",
        WebkitUserSelect: "none",
        zIndex: 50, // Add this
      }}>
      {/* Left Section */}
      <section
        className="flex items-center flex-shrink-0 "
        style={{
          WebkitAppRegion: "no-drag",
          WebkitUserSelect: "none",
        }}>
        <div className="ml-2">
          <WindowControls />
        </div>
        <BrowserControls
          activeTab={activeTabId ? tabs.find((tab) => tab.id === activeTabId) : ""}
          onBack={() => webviewRef.current.goBack()}
          onForward={() => webviewRef.current.goForward()}
          webviewRef={webviewRef}
        />
        <div
          className="relative"
          style={{ zIndex: 100 }}>
          <SettingsDropdown
            onLayoutChange={onLayoutChange}
            onThemeChange={onThemeChange}>
            <button className="ml-1 p-1.5  rounded text-foreground">
              <Settings
                strokeWidth={STYLE.browserControls.strokeWidth}
                className={`${STYLE.browserControls.size}`}
              />
            </button>
          </SettingsDropdown>
        </div>

        {/* URL Input */}
        <UrlInput
          onUrlSubmit={onUrlSubmit}
          urlInput={urlInput}
          onUrlChange={onUrlChange}
          isOpen={isUrlModalOpen}
          setIsUrlModalOpen={setIsUrlModalOpen} // Pass the setter instead of onClose
          className="min-w-[240px] max-w-[240px] mx-4"
        />
        <div
          className="flex items-center flex-shrink-0"
          style={{ WebkitAppRegion: "no-drag" }}>
          <button
            onClick={onNewTab}
            className="p-1 rounded text-foreground">
            <Plus
              strokeWidth={STYLE.browserControls.strokeWidth}
              className={`${STYLE.browserControls.size}`}
            />
          </button>
          {/* Add a wrapper div with higher z-index */}
        </div>
      </section>
      {/* Tabs Section with Swiper */}
      <section className="flex-1 flex items-center min-w-0">
        <button
          className={`p-1  rounded text-foreground-secondary z-10 mr-2 transition-opacity duration-200 ${isBeginning ? "opacity-30 pointer-events-none" : "opacity-100"}`}
          style={{ WebkitAppRegion: "no-drag" }}
          onClick={() => swiperRef?.slidePrev()}>
          <ChevronLeft
            strokeWidth={STYLE.browserControls.strokeWidth}
            className={`${STYLE.browserControls.size}`}
          />
        </button>

        <div
          className="flex-1 relative min-w-0"
          style={{
            WebkitAppRegion: "no-drag",
          }}>
          <Swiper
            modules={[FreeMode]}
            slidesPerView="auto"
            spaceBetween={4}
            freeMode={true}
            className="!static my-2"
            wrapperClass="!static"
            allowTouchMove
            onSwiper={(swiper) => setSwiperRef(swiper)}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}>
            {tabs.map((tab) => (
              <SwiperSlide
                key={tab.id}
                className="!w-auto !static">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabClick(tab.id);
                    }}
                    className={`
                       w-full relative ${STYLE.tab.default} justify-between min-w-[160px] max-w-[160px]
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
                      className="flex gap-2 items-center  w-full text-left truncate"
                      layout>
                      <motion.div
                        layout
                        className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        {tab.isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-foreground/50" />
                        ) : (
                          <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={getFaviconUrl(tab.url)}
                            className={`${STYLE.tab.favicon.size}`}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                      </motion.div>
                      <span className="truncate text-sm">{tab.isLoading ? <span className="text-background">Loading...</span> : tab.title || "New Tab"}</span>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id, e);
                      }}
                      className="opacity-100 group-hover:opacity-100 hover:bg-background-secondary/50 rounded p-0.5 text-foreground-secondary duration-150">
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          className={`p-1  rounded text-foreground-secondary z-10 ml-2 transition-opacity duration-200 ${isEnd ? "opacity-30 pointer-events-none" : "opacity-100"}`}
          style={{ WebkitAppRegion: "no-drag" }}
          onClick={() => swiperRef?.slideNext()}>
          <ChevronRight
            strokeWidth={STYLE.browserControls.strokeWidth}
            className={`${STYLE.browserControls.size}`}
          />
        </button>
      </section>
      {/* Action Buttons */}
    </div>
  );
};

export default TopBar;
