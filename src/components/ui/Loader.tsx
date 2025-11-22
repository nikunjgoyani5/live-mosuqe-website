export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {/* Spinner Circle */}
      <div className="w-16 h-16 border-4 border-primary-color border-t-transparent rounded-full animate-spin shadow-lg" />

      {/* Text with Pulse Effect */}
      <span className="ml-4 text-lg font-semibold text-gray-700 animate-pulse">
        Loading, please wait...
      </span>
    </div>
  );
}
