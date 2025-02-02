import React from "react";


const GradientLayer = () => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-[-1] backdrop-blur-lg bg-background/20 overflow-hidden `}>
      <div className="absolute inset-0 dark:mix-blend-multiply mix-blend-multiply backdrop-blur-2xl from-gray-50/20 to-gray-50/10 dark:from-sky-900/10 dark:to-blue-900/10 bg-gradient-to-r" />
       <div className="absolute inset-0 dark:mix-blend-multiply mix-blend-multiply backdrop-blur-2xl from-gray-50/20 to-gray-50/10 dark:from-sky-900/10 dark:to-blue-900/10 bg-gradient-to-l" />
       <div className="absolute inset-0 dark:mix-blend-multiply mix-blend-multiply backdrop-blur-2xl from-gray-50/20 to-gray-50/10 dark:from-sky-900/10 dark:to-blue-900/10 bg-gradient-to-b" />
       <div className="absolute inset-0 dark:mix-blend-multiply mix-blend-multiply backdrop-blur-2xl from-gray-50/20 to-gray-50/10 dark:from-sky-900/10 dark:to-blue-900/10 bg-gradient-to-t" />
    </div>
  );
};

export default GradientLayer;