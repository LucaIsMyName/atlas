import React from "react";

interface TabProps {
  children?: React.ReactNode;
  onClick?: () => void;
  activeTabId?: boolean;
}

const Tab = (children, onClick, isActiveTabId) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between gap-2 px-3 py-2 rounded cursor-pointer max-w-[160px] min-w-[160px] border border-foreground-secondary
      ${isActiveTabId ? "  bg-background-secondary shadow-sm" : "text-foreground-secondary "}
    `}>
      {children}
    </button>
  );
};

export default Tab;
