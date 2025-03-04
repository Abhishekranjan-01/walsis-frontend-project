import { Loader } from "lucide-react";

export default function ImagePreview({
  image,
  title,
  isLoading,
  error,
  ...props
}) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden max-w-full">
      {/* Header Section */}
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-800 text-center sm:text-left">
          {title}
        </h3>
      </div>

      {/* Image/Loading/Error Section */}
      <div className="relative w-full bg-gray-100 flex items-center justify-center aspect-square">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-600 text-sm">Processing image...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="text-red-600">{error}</p>
          </div>
        ) : image ? (
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-contain"
            {...props}
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">No image yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
