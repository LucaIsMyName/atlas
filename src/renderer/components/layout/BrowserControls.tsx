import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, Sparkles, Bookmark, Download, Trash2, ExternalLink } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import SummarizeModal from "./SummarizeModal";
import GradientLayer from "./GradientLayer";
import { STYLE } from "../../config";

// Storage keys
const STORAGE_KEYS = {
  BOOKMARKS: "browser_bookmarks",
  DOWNLOADS: "browser_downloads",
};

// Bookmark and Download interfaces
interface Bookmark {
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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  // Bookmark and Download Management
  const addBookmark = useCallback(
    (tab: any) => {
      if (!tab) return;

      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        url: tab.url,
        title: tab.title || tab.url,
        dateAdded: Date.now(),
      };

      // Check if bookmark already exists
      const existingBookmark = bookmarks.find((b) => b.url === newBookmark.url);
      if (existingBookmark) return;

      const updatedBookmarks = [newBookmark, ...bookmarks].slice(0, 20); // Limit to 20 bookmarks
      setBookmarks(updatedBookmarks);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    },
    [bookmarks]
  );

  const removeBookmark = useCallback(
    (id: string) => {
      const updatedBookmarks = bookmarks.filter((b) => b.id !== id);
      setBookmarks(updatedBookmarks);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    },
    [bookmarks]
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

  // Load bookmarks and downloads from localStorage on component mount
  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }

      const storedDownloads = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      if (storedDownloads) {
        setDownloads(JSON.parse(storedDownloads));
      }
    } catch (error) {
      console.error("Error loading bookmarks/downloads:", error);
    }
  }, []);

  // Canary vars for navigation
  const canGoBack = activeTab && activeTab.history && activeTab.history.length > 0 && activeTab.historyIndex > 0;

  const canGoForward = activeTab && activeTab.history && activeTab.history.length > 0 && activeTab.historyIndex < activeTab.history.length - 1;

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

  // Bookmark and Downloads Dropdown Content
  const bookmarkContent = (
    <div
      data-atlas="BookmarksDropdown"
      className={`relative text-foreground z-50 px-2 pb-2 ${STYLE.tab} !block !rounded-lg overflow-hidden`}>
      <GradientLayer />
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between p-2 border-b border-background/20">
          <span className="text-sm font-medium">Bookmarks</span>
        </div>
        {bookmarks.length === 0 ? (
          <div className="text-xs text-foreground/50 text-center py-4">No bookmarks saved</div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-2 hover:bg-background-secondary rounded-md transition-colors group">
                <div className="flex items-center space-x-2 flex-1 truncate">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 truncate text-sm hover:underline">
                    {bookmark.title}
                  </a>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => window.open(bookmark.url, "_blank")}
                    className="text-foreground/50 hover:text-foreground transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-red-500/50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
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
      className={`relative text-foreground z-50 px-2 pb-2 ${STYLE.tab} !block !rounded-lg overflow-hidden`}>
      <GradientLayer />
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between p-2 border-b border-background/20">
          <span className="text-sm font-medium">Downloads</span>
        </div>
        {downloads.length === 0 ? (
          <div className="text-xs text-foreground/50 text-center py-4">No recent downloads</div>
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
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeDownload(download.id)}
                    className="text-red-500/50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleForward}
          className={`p-1 ${canGoForward ? "hover:text-foreground/90" : "opacity-50 cursor-not-allowed"}`}>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (webviewRef.current) {
              webviewRef.current.reload();
            }
          }}
          className="p-1 hover:text-foreground/90">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={handleSummarize}
          className="p-1 hover:text-foreground/90"
          title="Summarize page">
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Bookmarks Button */}
        <Tippy
          content={bookmarkContent}
          interactive={true}
          arrow={false}
          placement="bottom"
          animation="scale"
          trigger="click"
          theme="custom"
          className="shadow-lg overflow-hidden min-w-[320px]">
          <button
            onClick={() => activeTab && addBookmark(activeTab)}
            className="p-1 hover:text-foreground/90"
            title="Bookmarks">
            <Bookmark className="w-4 h-4" />
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
            <Download className="w-4 h-4" />
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
