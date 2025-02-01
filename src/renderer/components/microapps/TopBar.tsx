import React from "react";
import { Plus, X, Loader2, RefreshCw, ArrowLeft, ArrowRight, Search, Settings } from "lucide-react";
import { getFaviconUrl } from "../utils/urlHelpers";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { STYLE } from "../../config";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

const TopBar = ({ tabs, activeTabId, urlInput, onUrlSubmit, onUrlChange, onNewTab, onCloseTab, onTabClick, onSettingsOpen }) => {
  return (
    <div
      className="h-14 flex items-center justify-between px-4 bg-background w-full"
      style={{ WebkitAppRegion: "drag", WebkitUserSelect: "none" }}>
      {/* Left Section */}
      <section className="flex items-center flex-shrink-0">
        <div
          className="flex items-center space-x-2 mr-4"
          style={{ WebkitAppRegion: "no-drag" }}>
          <button
            onClick={() => window.electronAPI.windowControls.close()}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
          />
          <button
            onClick={() => window.electronAPI.windowControls.minimize()}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
          />
          <button
            onClick={() => window.electronAPI.windowControls.maximize()}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
          />
        </div>

        {/* Navigation Controls */}
        <div
          className="flex items-center space-x-1 mr-2"
          style={{ WebkitAppRegion: "no-drag" }}>
          <button className="p-1 text-foreground-secondary hover:text-foreground hover:bg-background-secondary">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1 text-foreground-secondary hover:text-foreground hover:bg-background-secondary">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1 text-foreground-secondary hover:text-foreground hover:bg-background-secondary">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input */}
        <div
          className="flex items-center gap-2 px-3 py-1 bg-background-primary rounded mr-4 w-[300px]"
          style={{ WebkitAppRegion: "no-drag" }}>
          <Search className="w-4 h-4 text-foreground-secondary flex-shrink-0" />
          <form
            onSubmit={onUrlSubmit}
            className="flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-foreground-secondary"
              placeholder="Search or enter URL"
            />
          </form>
        </div>
      </section>

      {/* Tabs Section with Swiper */}
      <section className="flex-1 flex items-center min-w-0">
        <div className="flex-1 min-w-0" style={{ WebkitAppRegion: "no-drag" }}>
          <Swiper
            modules={[FreeMode]}
            slidesPerView="auto"
            spaceBetween={4}
            freeMode={true}
            className="!static"
            wrapperClass="!static">
            {tabs.map((tab) => (
              <SwiperSlide
                key={tab.id}
                className="!w-auto !static">
                <div
                  onClick={() => onTabClick(tab.id)}
                  className={`
                    ${STYLE.tab} w-[160px] 
                    ${activeTabId === tab.id ? "text-foreground bg-background-secondary shadow-sm" : "text-foreground-secondary hover:bg-background/50"}
                  `}>
                  <div className="flex gap-2 items-center truncate">
                    <div className="w-4 h-4 flex-shrink-0">
                      {tab.isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-foreground/50" />
                      ) : (
                        <img
                          src={getFaviconUrl(tab.url)}
                          className="w-4 h-4"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                    </div>
                    <span className="truncate text-sm">
                      {tab.isLoading ? 
                        <span className="text-foreground/30">Loading...</span> 
                        : tab.title || "New Tab"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => onCloseTab(tab.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:bg-background-secondary rounded p-0.5 text-foreground-secondary">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Action Buttons */}
        <div 
          className="flex items-center ml-2 flex-shrink-0" 
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <button
            onClick={onNewTab}
            className="p-1 hover:bg-background-secondary rounded text-foreground-secondary">
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onSettingsOpen}
            className="ml-1 p-1.5 hover:bg-background-secondary rounded text-foreground-secondary">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default TopBar;