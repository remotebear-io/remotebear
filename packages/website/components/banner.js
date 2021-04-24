export function Banner({ type = "info", className, children }) {
  let LeftElement;
  if (type === "info") {
    LeftElement = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 md:w-6 h-5 md:h-6 text-blue-900 mr-3 flex-shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  } else if (type === "new") {
    LeftElement = (
      <span className="rounded-md bg-blue-600 text-white px-2 py-1 text-xs font-bold mr-3">
        NEW
      </span>
    );
  }
  return (
    <div className={`flex w-full items-start text-blue-900 ${className}`}>
      <p className="flex w-full flex-row items-center px-4 py-2 bg-blue-50 rounded-md">
        {LeftElement}
        {children}
      </p>
    </div>
  );
}
