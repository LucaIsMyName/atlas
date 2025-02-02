import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, Mail, FileText } from "lucide-react";
import GradientLayer from "./GradientLayer";
import { STYLE } from "../../config";
import { motion, AnimatePresence } from "framer-motion";

const SummarizeModal = ({ isOpen, onClose, content }) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSummary("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setSummary("");
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const generateSummary = async () => {
    if (!content) return;

    setIsLoading(true);
    let errorMessage = "";

    const systemPrompt = `You are a browser's summarization feature. Analyze the following webpage content and create a structured summary that includes:

1. Main Topic/Title: The key subject or headline
2. Key Points: 3-5 main takeaways or important information
3. Important Details: Any specific dates, numbers, quotes, or statistics
4. Additional Context: Any relevant background information or context
5. Page Type: Whether this is an article, documentation, product page, etc.

Format the summary in a clear, structured way using these sections. Be concise but comprehensive.

Webpage content to analyze:
${content}`;

    // List of models to try in order
    const models = ["facebook/bart-large-cnn", "sshleifer/distilbart-cnn-12-6", "google/pegasus-xsum"];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: systemPrompt.slice(0, 2000),
            parameters: {
              max_length: 700,
              min_length: 150,
              temperature: 1,
              top_p: 0.95,
              do_sample: false,
            },
          }),
        });

        if (response.status === 503) {
          const result = await response.json();
          if (result.error === "Model is currently loading") {
            setSummary("Model is warming up, please wait...");
            // Wait for the model to load
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          }
        }

        if (!response.ok) {
          console.error(`Error with model ${model}:`, `HTTP error! status: ${response.status}`);
          continue;
        }

        const result = await response.json();
        console.log(`Response from ${model}:`, result);
        setIsLoading(false);

        if (result && Array.isArray(result) && result[0] && result[0].summary_text) {
          // Clean up the summary text
          let summaryText = result[0].summary_text
            .trim()
            .replace(/\s+/g, " ") // Replace multiple spaces with single space
            .replace(/\.+/g, ".") // Replace multiple periods with single period
            .replace(/\n+/g, "\n"); // Replace multiple newlines with single newline

          setSummary(summaryText);
          setIsLoading(false);

          return; // Success! Exit the function
        } else if (typeof result === "object" && result.summary_text) {
          // Handle different response format
          let summaryText = result.summary_text.trim().replace(/\s+/g, " ").replace(/\.+/g, ".").replace(/\n+/g, "\n");

          setSummary(summaryText);
          setIsLoading(false);

          return;
        }

        errorMessage = "Invalid response format";
        console.error(`Invalid response from ${model}:`, result);
      } catch (error) {
        errorMessage = error.message;
        console.error(`Error with model ${model}:`, error);
      }
    }

    setSummary(`Sorry, I couldn't generate a summary at this time. ${errorMessage}`);
    setIsLoading(false);
  };

  const handleExport = () => {
    const blob = new Blob([summary], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.doc";
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL
  };

  const handleEmail = () => {
    const subject = "Page Summary";
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-[101]">
          <motion.div
            ref={modalRef}
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 350,
            }}
            className="relative w-full max-w-md mr-4 ml-auto h-[calc(100vh-theme(spacing.4)*2)] top-0 bottom-0 rounded-lg shadow-lg overflow-hidden">
            <GradientLayer />
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-0">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-semibold text-foreground">
                Page Summary
              </motion.h2>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={handleClose}
                className="p-1 hover:bg-background-secondary rounded-md transition-colors">
                <X className="w-4 h-4 text-foreground" />
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 min-h-[200px]">
              {!summary && !isLoading && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={generateSummary}
                  className={`relative px-4 py-2 rounded-md text-sm font-medium ${STYLE.tab} transition-colors`}>
                  <GradientLayer />
                  Generate Summary
                </motion.button>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-foreground/70">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating summary...</span>
                </motion.div>
              )}

              {summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="space-y-4">
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{summary}</p>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExport}
                      className={`${STYLE.tab} relative text-sm border border-border/10 rounded-md hover:bg-background-secondary transition-colors`}>
                      <GradientLayer />
                      <FileText className="h-4 w-4" />
                      <span>Export as Word</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEmail}
                      className={`${STYLE.tab} relative text-sm border border-border/10 rounded-md hover:bg-background-secondary transition-colors`}>
                      <GradientLayer />
                      <Mail className="h-4 w-4" />
                      <span>Share via Email</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SummarizeModal;
