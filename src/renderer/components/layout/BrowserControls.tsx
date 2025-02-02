import React, { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import SummarizeModal from "./SummarizeModal";

const BrowserControls = ({ webviewRef, activeTab, onBack, onForward }) => {
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);
  const [pageContent, setPageContent] = useState("");
  const canGoBack = activeTab && activeTab.historyIndex > 0;
  const canGoForward = activeTab && activeTab.historyIndex < activeTab.history.length - 1;

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
    console.log("Handling summarize click");
    console.log("Webview ref:", webviewRef);

    if (!webviewRef?.current) {
      console.error("Webview reference not available");
      return;
    }

    try {
      // Get page content from webview
      const content = await webviewRef.current.executeJavaScript(`
        (function() {
          try {
            // Try different methods to get the page content
            const mainContent = document.querySelector('main') || document.querySelector('article');
            if (mainContent) {
              return mainContent.innerText;
            }
            
            // If no main content area, get all paragraph text
            const paragraphs = Array.from(document.getElementsByTagName('p'));
            if (paragraphs.length > 0) {
              return paragraphs.map(p => p.innerText).join('\\n\\n');
            }
            
            // Fallback to body text
            return document.body.innerText || document.body.textContent;
          } catch (e) {
            console.error('Error extracting content:', e);
            return '';
          }
        })()
      `);

      console.log("Content extraction successful");
      console.log("Content length:", content?.length);
      console.log("Preview:", content?.slice(0, 100));

      if (!content) {
        throw new Error("No content found on page");
      }

      setPageContent(content);
      setIsSummarizeOpen(true);
    } catch (error) {
      console.error("Error in handleSummarize:", error);
    }
  };

  return (
    <>
      <div
        className="flex items-center space-x-1"
        style={{ WebkitAppRegion: "no-drag" }}>
        <button
          onClick={handleBack}
          className={`p-1 ${canGoBack ? 'hover:text-foreground/90' : 'opacity-50 cursor-not-allowed'}`}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleForward}
          className={`p-1 ${canGoForward ? 'hover:text-foreground/90' : 'opacity-50 cursor-not-allowed'}`}>
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
      </div>

      <SummarizeModal
        isOpen={isSummarizeOpen}
        onClose={() => setIsSummarizeOpen(false)}
        content={pageContent}
      />
    </>
  );
};

export default BrowserControls;
