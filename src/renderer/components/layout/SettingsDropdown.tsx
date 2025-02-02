import React from "react";
import { Sun, Moon, LayoutTemplate, Sidebar } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import GradientLayer from "./GradientLayer";

const STORAGE_KEYS = {
  THEME: "browser_theme",
  LAYOUT: "browser_layout",
};

const SettingsDropdown = ({ children, onLayoutChange, onThemeChange }) => {
  const [theme, setTheme] = React.useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || "light");

  const [layout, setLayout] = React.useState(() => localStorage.getItem(STORAGE_KEYS.LAYOUT) || "topbar");

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

  const content = (
    <div className="relative z-50 px-2 pb-2 min-w-48 space-y-2 rounded-lg shadow-lg border border-background-secondary overflow-hidden">
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
    </div>
  );

  return (
    <Tippy
      content={content}
      interactive={true}
      arrow={false}
      placement="bottom-end"
      animation="scale"
      trigger="click"
      theme="custom"
      className="shadow-lg overflow-hidden">
      {children}
    </Tippy>
  );
};

export default SettingsDropdown;
