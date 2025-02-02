import React from "react";
import { Sun, Moon, LayoutTemplate, Sidebar, Search } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import GradientLayer from "./GradientLayer";
import { STYLE } from "../../config";

const STORAGE_KEYS = {
  THEME: "browser_theme",
  LAYOUT: "browser_layout",
  SEARCH_ENGINE: "browser_search_engine",
};

const SEARCH_ENGINES = {
  google: {
    name: "Google",
    url: "https://www.google.com/search?q=",
  },
  duckduckgo: {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
  },
  bing: {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
  },
  ecosia: {
    name: "Ecosia",
    url: "https://www.ecosia.org/search?q=",
  },
};

const SettingsDropdown = ({ children, onLayoutChange, onThemeChange }) => {
  const [theme, setTheme] = React.useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || "light");
  const [layout, setLayout] = React.useState(() => localStorage.getItem(STORAGE_KEYS.LAYOUT) || "topbar");
  const [searchEngine, setSearchEngine] = React.useState(() => localStorage.getItem(STORAGE_KEYS.SEARCH_ENGINE) || "google");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const savedLayout = localStorage.getItem(STORAGE_KEYS.LAYOUT);

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedLayout) {
      setLayout(savedLayout);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const toggleLayout = () => {
    const newLayout = layout === "topbar" ? "sidebar" : "topbar";
    setLayout(newLayout);
    localStorage.setItem(STORAGE_KEYS.LAYOUT, newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  const handleSearchEngineChange = (e) => {
    const newEngine = e.target.value;
    setSearchEngine(newEngine);
    localStorage.setItem(STORAGE_KEYS.SEARCH_ENGINE, newEngine);
  };

  const content = (
    <div data-atlas="SettingsDropdown" className={`relative text-foreground z-50 px-2 pb-2 ${STYLE.tab} !block !rounded-lg overflow-hidden`}>
      <GradientLayer />
      <div className="relative z-10 flex items-center justify-between p-2 rounded-lg transition-colors">
        <span className="text-sm font-medium ">Theme</span>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-full">
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center justify-between p-2 rounded-md transition-colors">
        <span className="text-sm font-medium ">Layout</span>
        <button
          onClick={toggleLayout}
          className="p-1.5 rounded-full">
          {layout === "topbar" ? <Sidebar className="w-4 h-4" /> : <LayoutTemplate className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center justify-between p-2 rounded-md transition-colors">
        <span className="text-sm font-medium">Search Engine</span>
        <select
          value={searchEngine}
          onChange={handleSearchEngineChange}
          className="bg-transparent p-1 rounded text-sm outline-none">
          {Object.entries(SEARCH_ENGINES).map(([key, engine]) => (
            <option
              key={key}
              value={key}>
              {engine.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <Tippy
      content={content}
      interactive={true}
      arrow={false}
      placement="bottom"
      animation="scale"
      trigger="click"
      theme="custom"
      className="shadow-lg overflow-hidden min-w-[320px]">
      {children}
    </Tippy>
  );
};

export default SettingsDropdown;
