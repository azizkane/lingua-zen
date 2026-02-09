export const BreathingLoader = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 border-4 border-indigo-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
