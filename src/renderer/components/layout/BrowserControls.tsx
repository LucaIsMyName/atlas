import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, History, Github, Globe, ArrowRight, Info, RefreshCw, GalleryHorizontalEnd, Sparkles, Bookmark, Download, Trash2, ExternalLink, DownloadIcon } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import SummarizeModal from "./SummarizeModal";
import GradientLayer from "./GradientLayer";
import { STYLE } from "../../config";

// Storage keys
const STORAGE_KEYS = {
  HISTORY: "browser_history",
  DOWNLOADS: "browser_downloads",
};

// History and Download interfaces
interface HistoryItem {
  id: string;
  url: string;
  title: string;
  dateAdded: number;
}

interface DownloadItem {
  id: string;
  filename: string;
  path: string;
  url: string;
  dateAdded: number;
}

const BrowserControls = ({ webviewRef, activeTab, onBack, onForward }) => {
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);
  const [pageContent, setPageContent] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [appInfo, setAppInfo] = useState(null);

  useEffect(() => {
    const loadAppInfo = async () => {
      try {
        const response = await fetch("/info.json");
        const info = await response.json();
        setAppInfo(info);
      } catch (error) {
        console.error("Error loading app info:", error);
      }
    };
    loadAppInfo();
  }, []);
  // History and Download Management
  const addToHistory = useCallback(
    (tab: any) => {
      if (!tab) return;

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        url: tab.url,
        title: tab.title || tab.url,
        dateAdded: Date.now(),
      };

      // Check if history item already exists
      const existingItem = history.find((b) => b.url === newHistoryItem.url);
      if (existingItem) return;

      const updatedHistory = [newHistoryItem, ...history].slice(0, 20); // Limit to 20 items
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    },
    [history]
  );

  const removeFromHistory = useCallback(
    (id: string) => {
      const updatedHistory = history.filter((b) => b.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    },
    [history]
  );

  const addDownload = useCallback(
    (downloadInfo: Partial<DownloadItem>) => {
      const newDownload: DownloadItem = {
        id: Date.now().toString(),
        filename: downloadInfo.filename || "Unknown",
        path: downloadInfo.path || "",
        url: downloadInfo.url || "",
        dateAdded: Date.now(),
      };

      const updatedDownloads = [newDownload, ...downloads].slice(0, 5); // Limit to 5 downloads
      setDownloads(updatedDownloads);
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(updatedDownloads));
    },
    [downloads]
  );

  const removeDownload = useCallback(
    (id: string) => {
      const updatedDownloads = downloads.filter((d) => d.id !== id);
      setDownloads(updatedDownloads);
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(updatedDownloads));
    },
    [downloads]
  );

  // Load history and downloads from localStorage on component mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      const storedDownloads = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      if (storedDownloads) {
        setDownloads(JSON.parse(storedDownloads));
      }
    } catch (error) {
      console.error("Error loading history/downloads:", error);
    }
  }, []);

  // Canary vars for navigation
  const canGoBack = activeTab?.history?.canGoBack?.() || false;

  const canGoForward = activeTab?.history?.canGoForward?.() || false;

  const handleBack = () => {
    if (canGoBack && activeTab) {
      onBack(activeTab.id);
    }
  };
  
  const handleForward = () => {
    if (canGoForward && activeTab) {
      onForward(activeTab.id);
    }
  };

  const handleSummarize = async () => {
    if (!webviewRef?.current) {
      console.error("Webview reference not available");
      return;
    }

    try {
      const content = await webviewRef.current.executeJavaScript(`
        (function() {
          try {
            const mainContent = document.querySelector('main') || document.querySelector('article');
            if (mainContent) {
              return mainContent.innerText;
            }
            
            const paragraphs = Array.from(document.getElementsByTagName('p'));
            if (paragraphs.length > 0) {
              return paragraphs.map(p => p.innerText).join('\\n\\n');
            }
            
            return document.body.innerText || document.body.textContent;
          } catch (e) {
            console.error('Error extracting content:', e);
            return '';
          }
        })()
      `);

      if (!content) {
        throw new Error("No content found on page");
      }

      setPageContent(content);
      setIsSummarizeOpen(true);
    } catch (error) {
      console.error("Error in handleSummarize:", error);
    }
  };

  // History and Downloads Dropdown Content
  const historyContent = (
    <div
      data-atlas="HistoryDropdown"
      style={{ WebkitAppRegion: "no-drag" }}
      className={`relative text-foreground bg-background/90 backdrop-blur-lg z-50 px-2 pb-2 !block !rounded-lg !overflow-hidden`}>
      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-2 py-2">
          <History
            strokeWidth={STYLE.browserControls.strokeWidth}
            className="size-4"
          />
          <span className="text-sm font-medium">History</span>
        </div>
        {history.length === 0 ? (
          <div className="text-xs text-foreground/50 text-center py-4">No history items</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className={`${STYLE.tab.default} justify-between transition-colors group`}>
                <div className="flex items-center space-x-2 flex-1 truncate">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 truncate text-sm">
                    {item.title}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(item.url, "_blank")}
                    className="text-foreground/80 transition-colors">
                    <ExternalLink
                      strokeWidth={STYLE.browserControls.strokeWidth}
                      className="w-3.5 h-3.5"
                    />
                  </button>
                  <button
                    onClick={() => removeFromHistory(item.id)}
                    className="text-red-500/80 dark:text-red-400 hover:text-red-500 transition-colors">
                    <Trash2
                      strokeWidth={STYLE.browserControls.strokeWidth}
                      className="w-3.5 h-3.5"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const downloadsContent = (
    <div
      data-atlas="DownloadsDropdown"
      style={{ WebkitAppRegion: "no-drag" }}
      className={`relative text-foreground z-50 px-2 pb-2 bg-background/90 backdrop-blur-lg rounded-lg overflow-hidden`}>
      {/* <GradientLayer className="rounded-lg overflow-hidden" /> */}
      <div className="relative z-10 space-y-2 ">
        <div className="flex items-center gap-2 py-2">
          <DownloadIcon
            strokeWidth={STYLE.browserControls.strokeWidth}
            className="size-4"
          />
          <span className="text-sm font-medium">Downloads</span>
        </div>
        {downloads.length === 0 ? (
          <div className="text-xs text-foreground/50  pb-1">No recent downloads</div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {downloads.map((download) => (
              <div
                key={download.id}
                className="flex items-center justify-between p-2 hover:bg-background-secondary rounded-md transition-colors group">
                <div className="flex items-center space-x-2 flex-1 truncate">
                  <span className="flex-1 truncate text-sm">{download.filename}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      // Implement file open logic
                      console.log("Open file:", download.path);
                    }}
                    className="text-foreground/50 hover:text-foreground transition-colors">
                    <ExternalLink
                      strokeWidth={STYLE.browserControls.strokeWidth}
                      className={`${STYLE.browserControls.size}`}
                    />
                  </button>
                  <button
                    onClick={() => removeDownload(download.id)}
                    className="text-red-500/50 hover:text-red-500 transition-colors">
                    <Trash2
                      strokeWidth={STYLE.browserControls.strokeWidth}
                      className={`${STYLE.browserControls.size}`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const infoContent = (
    <div
      data-atlas="InfoDropdown"
      style={{ WebkitAppRegion: "no-drag" }}
      className={`user-select-none relative text-foreground bg-background/90 backdrop-blur-lg z-50 px-2 pb-2 !block !rounded-lg overflow-hidden`}>
      <div className="relative z-10 space-y-2 mt-2">
        {appInfo ? (
          <div className="p-4 space-y-4 select-none">
            <div className="flex items-center justify-center mb-4">
              <img
                src={`/${appInfo.logo}`}
                alt={`${appInfo.appName} logo`}
                className="w-16 h-16 rounded-xl shadow-lg border"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">{appInfo.appName}</h3>
              <p className="text-xs text-foreground/80">{appInfo.description}</p>
              <p className="text-xs text-foreground/50">
                Version <br></br><span className="font-mono">{appInfo.version}</span>
              </p>
            </div>
            <section className="text-center flex justify-center gap-2">
              <a
                href="https://github.com/"
                className={`${STYLE.tab.default} text-foreground-secondary hover:text-foreground text-xs !px-2 !py-0.5`}>
                <Github
                  className="size-3"
                  strokeWidth={2}
                />
                <span>Github</span>
              </a>
              <a className={`${STYLE.tab.default} text-foreground-secondary hover:text-foreground text-xs !px-2 !py-1`}>
                <Globe
                  className="size-3"
                  strokeWidth={2}
                />
                <span>Website</span>
              </a>
            </section>
          </div>
        ) : (
          <div className="text-xs text-foreground/50 text-center py-4">Loading app info...</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="flex items-center space-x-1"
        style={{ WebkitAppRegion: "no-drag" }}>
        <button
          onClick={handleBack}
          className={`p-1 ${canGoBack ? "hover:text-foreground/90" : "opacity-50 cursor-not-allowed"}`}>
          <ArrowLeft
            strokeWidth={STYLE.browserControls.strokeWidth}
            className={`${STYLE.browserControls.size}`}
          />
        </button>
        <button
          onClick={handleForward}
          className={`p-1 ${canGoForward ? "hover:text-foreground/90" : "opacity-50 cursor-not-allowed"}`}>
          <ArrowRight
            strokeWidth={STYLE.browserControls.strokeWidth}
            className={`${STYLE.browserControls.size}`}
          />
        </button>
        <button
          onClick={() => {
            if (webviewRef.current) {
              webviewRef.current.reload();
            }
          }}
          className="p-1 hover:text-foreground/90">
          <RefreshCw
            strokeWidth={STYLE.browserControls.strokeWidth}
            className={`${STYLE.browserControls.size}`}
          />
        </button>
        <button
          onClick={handleSummarize}
          className="p-1 hover:text-foreground/90"
          title="Summarize page">
          <Sparkles
            strokeWidth={STYLE.browserControls.strokeWidth}
            className={`${STYLE.browserControls.size}`}
          />
        </button>

        {/* History Button */}
        <Tippy
          content={historyContent}
          interactive={true}
          arrow={false}
          placement="bottom"
          animation="scale"
          trigger="click"
          theme="custom"
          className="shadow-lg overflow-hidden min-w-[320px]">
          <button
            onClick={() => activeTab && addToHistory(activeTab)}
            className="p-1 hover:text-foreground/90"
            title="History">
            <History
              strokeWidth={STYLE.browserControls.strokeWidth}
              className={`${STYLE.browserControls.size}`}
            />
          </button>
        </Tippy>

        {/* Downloads Button */}
        <Tippy
          content={downloadsContent}
          interactive={true}
          arrow={false}
          placement="bottom"
          animation="scale"
          trigger="click"
          theme="custom"
          className="shadow-lg overflow-hidden min-w-[320px]">
          <button
            className="p-1 hover:text-foreground/90"
            title="Downloads">
            <Download
              strokeWidth={STYLE.browserControls.strokeWidth}
              className={`${STYLE.browserControls.size}`}
            />
          </button>
        </Tippy>

        {/* Info Button */}
        <Tippy
          content={infoContent}
          interactive={true}
          arrow={false}
          placement="bottom"
          animation="scale"
          trigger="click"
          theme="custom"
          className="shadow-lg overflow-hidden min-w-[280px]">
          <button
            className="p-1 hover:text-foreground/90"
            title="App Info">
            <Info
              strokeWidth={STYLE.browserControls.strokeWidth}
              className={`${STYLE.browserControls.size}`}
            />
          </button>
        </Tippy>
      </div>

      <SummarizeModal
        isOpen={isSummarizeOpen}
        onClose={() => setIsSummarizeOpen(false)}
        content={pageContent}
        currentTab={activeTab}
      />
    </>
  );
};

export default BrowserControls;
