import React from "react";

const GradientLayer = (className: string) => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-[-1] backdrop-blur-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0 backdrop-blur-2xl dark:bg-blue-900/10" />
      <div className="absolute inset-0 dark:mix-blend-lighten mix-blend-multiply backdrop-blur-2xl from-yellow-50 to-orange-50 dark:from-sky-900 dark:to-blue-300 bg-gradient-to-r" />
      <div className="absolute inset-0 dark:mix-blend-lighten mix-blend-multiply backdrop-blur-2xl from-gray-50/10 to-amber-50/10 dark:from-blue-900/10 dark:to-sky-300/10 bg-gradient-to-t" />
      <div className="absolute inset-0 dark:mix-blend-lighten mix-blend-multiply backdrop-blur-2xl from-gray-50/10 to-amber-50/10 dark:from-blue-900/10 dark:to-emerald-300/10 bg-gradient-to-l" />
      <div className="absolute inset-0 dark:mix-blend-lighten mix-blend-multiply backdrop-blur-2xl from-gray-50/10 to-amber-50/10 dark:from-blue-900/10 dark:to-emerald-300/10 bg-gradient-to-r" />
      <div className="absolute inset-0 dark:mix-blend-lighten mix-blend-multiply backdrop-blur-2xl from-gray-50/10 to-amber-50/10 dark:from-blue-900/10 dark:to-emerald-300/10 bg-gradient-to-r" />
      <div className="absolute inset-0 dark:mix-blend-lighten mix-blend-multiply backdrop-blur-2xl from-yellow-50/10 to-orange-50/10 dark:from-emerald-900/10 dark:to-blue-300/10 bg-gradient-to-b" />
      <div className="opacity-90 absolute inset-0 mix-blend-multiply bg-white/10 dark:bg-black/90" />
    </div>
  );
};

export default GradientLayer;
