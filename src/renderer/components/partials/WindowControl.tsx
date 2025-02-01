const WindowControl = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`w-3 h-3 rounded-full transition-colors duration-150 focus:outline-none ${className}`}
    />
  );
};
