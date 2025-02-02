import React, { useState } from "react"; // Add useState import
import { Plus, X, Loader2, RefreshCw, ArrowLeft, ArrowRight, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
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

const TopBar = ({ className, tabs, activeTabId, urlInput, onUrlSubmit, onUrlChange, onNewTab, onCloseTab, onTabClick, onSettingsOpen, onThemeChange, onLayoutChange }) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div
      className="relative flex items-center justify-between px-2 w-full"
      style={{
        WebkitAppRegion: "drag",
        WebkitUserSelect: "none",
        zIndex: 50, // Add this
      }}>
      {/* Left Section */}
      <section className="flex items-center flex-shrink-0">
        <div className="pl-2">
          <WindowControls />
        </div>
        <BrowserControls />

        {/* URL Input */}
        <UrlInput
          onUrlSubmit={onUrlSubmit}
          urlInput={urlInput}
          onUrlChange={onUrlChange}
          className="w-[300px] mx-4"
        />
      </section>
      {/* Tabs Section with Swiper */}
      <section className="flex-1 flex items-center min-w-0">
        <button
          className={`p-1  rounded text-foreground-secondary z-10 mr-2 transition-opacity duration-200 ${isBeginning ? "opacity-30 pointer-events-none" : "opacity-100"}`}
          style={{ WebkitAppRegion: "no-drag" }}
          onClick={() => swiperRef?.slidePrev()}>
          <ChevronLeft className="w-4 h-4" />
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
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // Stop event from reaching Swiper
                    onTabClick(tab.id);
                  }}
                  className={`
                    ${STYLE.tab} w-[160px] group relative
                    ${activeTabId === tab.id ? "text-background bg-foreground/90 shadow-inner" : "text-foreground-secondary "}
                  `}>
                  <GradientLayer className="" />
                  <div className="flex gap-2 items-center truncate">
                    <div className="w-4 h-4 flex-shrink-0">
                      {tab.isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-foreground/50" />
                      ) : (
                        <img
                          src={getFaviconUrl(tab.url)}
                          className="w-4 h-4"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                    <span className="truncate text-sm">{tab.isLoading ? <span className="text-foreground/30">Loading...</span> : tab.title || "New Tab"}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event from reaching parent elements
                      onCloseTab(tab.id, e);
                    }}
                    className="opacity-100 group-hover:opacity-100 hover:bg-background-secondary/50 rounded p-0.5 text-foreground-secondary transition-all duration-150">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          className={`p-1  rounded text-foreground-secondary z-10 ml-2 transition-opacity duration-200 ${isEnd ? "opacity-30 pointer-events-none" : "opacity-100"}`}
          style={{ WebkitAppRegion: "no-drag" }}
          onClick={() => swiperRef?.slideNext()}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>
      {/* Action Buttons */}
      <div
        className="flex items-center ml-2 flex-shrink-0"
        style={{ WebkitAppRegion: "no-drag" }}>
        <button
          onClick={onNewTab}
          className="p-1 rounded text-foreground">
          <Plus className="w-4 h-4" />
        </button>
        {/* Add a wrapper div with higher z-index */}
        <div
          className="relative"
          style={{ zIndex: 9999 }}>
          <SettingsDropdown
            onLayoutChange={onLayoutChange}
            onThemeChange={onThemeChange}>
            <button className="ml-1 p-1.5  rounded text-foreground">
              <Settings className="w-4 h-4" />
            </button>
          </SettingsDropdown>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
