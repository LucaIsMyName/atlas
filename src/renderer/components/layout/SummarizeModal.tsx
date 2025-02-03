import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { X, Loader2, Mail, FileText, Sparkles } from "lucide-react";
import GradientLayer from "./GradientLayer";
import { STYLE } from "../../config";
import { motion, AnimatePresence } from "framer-motion";
import { HUGGING_FACE_API } from "../../../../apiKeys";
import { WebContentsView } from "electron";

const SummarizeModal = ({ isOpen, onClose, content, currentTab }) => {
  const [summary, setSummary] = useState("");
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const hasGeneratedRef = useRef(false); // Track if we've already generated a summary

  useEffect(() => {
    if (model) {
      console.log(`Generated summary using model: ${model}`);
    }
  }, [model]);

  useEffect(() => {
    if (!isOpen) {
      setSummary("");
      setIsLoading(false);
      hasGeneratedRef.current = false; // Reset the flag when modal closes
    } else if (!hasGeneratedRef.current) {
      // Only generate if we haven't already
      generateSummary();
      hasGeneratedRef.current = true; // Mark that we've generated a summary
    }
  }, [isOpen]);

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

    const systemPrompt = `Summarize the following content in a clear way with bullet points and Sub headlines: ${content}`;
    const apiKey = HUGGING_FACE_API;
    if (!apiKey) {
      throw new Error("API key not found");
    }

    // List of models to try in order
    const models = ["facebook/bart-large-cnn", "sshleifer/distilbart-cnn-12-6", "google/pegasus-xsum"];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            inputs: systemPrompt.slice(0, 1500),
            parameters: {
              max_length: 300,
              min_length: 150,
              temperature: 0.7,
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
          setModel(model);
          setSummary(summaryText);
          setIsLoading(false);

          return; // Success! Exit the function
        } else if (typeof result === "object" && result.summary_text) {
          // Handle different response format
          let summaryText = result.summary_text.trim().replace(/\s+/g, " ").replace(/\.+/g, ".").replace(/\n+/g, "\n");
          setModel(model);

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
    setModel(null);
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

  const getModelName = (modelId) => {
    if (modelId === "facebook/bart-large-cnn") {
      return "BART Large CNN";
    } else if (modelId === "sshleifer/distilbart-cnn-12-6") {
      return "DistilBART CNN";
    } else if (modelId === "google/pegasus-xsum") {
      return "Pegasus XSum";
    } else {
      return "Unknown model";
    }
  };

  if (!isOpen) return null;

  const getTabTitle = (tab) => {
    if (tab.title) {
      return tab.title;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-atlas="SummarizeModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[101]">
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
            className="bg-background/90 backdrop-blur-lg relative w-full max-w-md mr-4 ml-auto h-[calc(100vh-theme(spacing.4)*2)] top-0 bottom-0 rounded-lg shadow-lg overflow-hidden">
            
            {/* Header */}
            <div className=" p-4 pb-0 flex flex-col">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className=" text-foreground-secondary text-xs flex gap-2 items-center mb-2 ">
                <span className={`pr-3 pl-2 py-1 ${STYLE.color.bg.primary} text-white w-max-content overflow-hidden rounded-full border-2 shadow-sm border-[rgba(0,0,0,0.5)] inline-flex items-center gap-2 relative`}>
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}>
                    <Sparkles className="size-3.5" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}>
                    <span className="flex-1 w-full text-xs font-mono  font-regular">AI Summary</span>
                  </motion.div>
                </span>
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className=" text-foreground flex gap-2 flex-wrap">
                <span className="text-lg">{getTabTitle(currentTab)}</span>
              </motion.h2>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 ">
                <X className="w-4 h-4 text-foreground" />
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 min-h-[200px]">
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
                  {model && (
                    <p className="text-xs text-foreground/70">
                      <span className="inline-block mr-1">Generated by</span>
                      <a
                        target="_blank"
                        href={`https://huggingface.co/search/full-text?q=${getModelName(model).replace(" ", "+")}&type=model`}
                        className="inline-block text-[1em]  border-b py-[0.1em]">
                        {getModelName(model)}{" "}
                      </a>
                      <span className="inline-block mx-1"> on </span>
                      <a
                        target="_blank"
                        href="https://huggingface.co/"
                        className="inline-block text-[1em]  border-b py-[0.1em]">
                        HuggingFace
                      </a>
                    </p>
                  )}
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap user-select-text">{summary}</p>

                  <div className="user-select-none flex gap-4 flex-wrap justify-start mt-4 pt-4 border-t border-foreground/20">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExport}
                      className={` relative text-xs flex gap-2 items-center hover:bg-background-secondary transition-colors`}>
                      <FileText className="h-4 w-4" />
                      <span>Export as Word</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEmail}
                      className={` relative text-xs flex gap-2 items-center hover:bg-background-secondary transition-colors`}>
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
