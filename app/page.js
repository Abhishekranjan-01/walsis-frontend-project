"use client";
import BackgroundRemover from "@/components/background-remover";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-700">
              remove<span className="text-gray-400">bg</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 font-medium">
              Remove Background
            </a>
            <a href="#" className="text-gray-700 font-medium">
              Features
            </a>
            <a href="#" className="text-gray-700 font-medium">
              For Business
            </a>
            <a href="#" className="text-gray-700 font-medium">
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-700 font-medium">
              Log in
            </a>
            <a
              href="#"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
            >
              Sign up
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <BackgroundRemover />
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} Background Remover. This is a demo
          application.
        </p>
      </footer>
    </div>
  );
}
