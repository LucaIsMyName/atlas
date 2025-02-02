import React from 'react';
import { Sun, Moon, X, LayoutTemplate, Sidebar } from 'lucide-react';

const STORAGE_KEYS = {
  THEME: 'browser_theme',
  LAYOUT: 'browser_layout'
};

const SettingsModal = ({ isOpen, onClose, onLayoutChange, onThemeChange }) => {
  const [theme, setTheme] = React.useState(() => 
    localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
  );

  const [layout, setLayout] = React.useState(() => 
    localStorage.getItem(STORAGE_KEYS.LAYOUT) || 'topbar'
  );

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

  if (!isOpen) return null;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const toggleLayout = () => {
    const newLayout = layout === 'topbar' ? 'sidebar' : 'topbar';
    setLayout(newLayout);
    localStorage.setItem(STORAGE_KEYS.LAYOUT, newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div 
        className="bg-background rounded-lg w-full max-w-md shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-background-secondary">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Browser Settings</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-foreground-secondary hover:text-background-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-2 pl-4 rounded-lg bg-background-secondary">
            <span className="text-sm font-medium text-foreground">Theme</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full  transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-2 pl-4 rounded-lg bg-background-secondary">
            <span className="text-sm font-medium text-foreground-secondary">Layout</span>
            <button
              onClick={toggleLayout}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground-secondary transition-colors"
            >
              {layout === 'topbar' ? (
                <Sidebar className="w-5 h-5" />
              ) : (
                <LayoutTemplate className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;