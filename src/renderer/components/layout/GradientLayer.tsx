import React from "react";

const GradientLayer = ({ color, className = "" }) => {
  const getColor = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500/90 to-blue-400/30";
      case "green":
        return "from-green-500/90 to-green-400/30";
      case "red":
        return "from-red-500/90 to-red-400/30";
      case "yellow":
        return "from-yellow-500/90 to-yellow-400/30";
      case "purple":
        return "from-purple-500/90 to-purple-400/30";
      case "pink":
        return "from-pink-500/90 to-pink-400/30";
      case "indigo":
        return "from-indigo-500/90 to-indigo-400/30";
      case "cyan":
        return "from-cyan-500/90 to-cyan-400/30";
      case "teal":
        return "from-teal-500/90 to-teal-400/30";
      case "gray":
        return "from-gray-500/90 to-gray-400/30";
      default:
        return "from-gray-500/90 to-gray-400/30";
    }
  };

  return (
    <div
      data-atlas="GradientLayer"
      className={`absolute inset-0 pointer-events-none backdrop-blur-lg bg-background/30 overflow-hidden ${className}`}>
      <div className="absolute inset-0 dark:mix-blend-multiply mix-blend-multiply backdrop-blur-2xl from-gray-50/20 to-gray-50/10 dark:from-gray-900/30 dark:to-gray-900/10 bg-gradient-to-r" />
      <div className="absolute inset-0 dark:mix-blend-multiply mix-blend-multiply backdrop-blur-2xl from-gray-50/20 to-gray-50/10 dark:from-gray-900/30 dark:to-gray-900/10 bg-gradient-to-l" />
      {color && <div className={`opacity-90 absolute inset-0 dark:mix-blend-multiply mix-blend-lighten z-20 backdrop-blur-2xl ${getColor(color)}`} />}
    </div>
  );
};

export default GradientLayer;
