export const STYLE = {
  tab: {
    default: `group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer border-[1.5px] shadow-[inset_3px_3px_10px_#c3c3c333] dark:shadow-[inset_3px_3px_10px_#00000033] shadow-inner border-foreground-secondary/30`,
    active: `group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer border-[1.5px] shadow-[inset_3px_3px_5px_#c9c9c966] bg-background-secondary text-foreground border-foreground-secondary/90`,
    favicon: {
      size: `size-3.5 w-3.5 h-3.5 lg:size-5 lg:w-4 lg:min-w-4 lg:min-h-4 lg:h-4`,
    },
  },
  windowControls: {
    size: `size-3 w-3 h-3 lg:size-3.5 lg:w-3.5 lg:h-3.5`,
    iconSize: `size-2.5`,
    color: {
      close: `bg-red-500`,
      min: `bg-yellow-500`,
      max: `bg-green-500`,
    },
  },
  browserControls: {
    strokeWidth: 1.5,
    size: `size-3.5 w-3.5 h-3.5 lg:size-4 lg:w-4 lg:h-4`,
    color: `text-foreground/80`,
    colorActive: `text-foreground`,
  },
};
