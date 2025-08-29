import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const LuminaHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const itemTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleItemMouseEnter = () => {
    if (itemTimeoutRef.current) {
      clearTimeout(itemTimeoutRef.current);
    }
    setIsItemDropdownOpen(true);
  };

  const handleItemMouseLeave = () => {
    itemTimeoutRef.current = setTimeout(() => {
      setIsItemDropdownOpen(false);
    }, 150);
  };

  return (
    <div className="flex items-center gap-24 relative z-50 justify-between px-32">
      <img src="/lumina_logo.svg" alt="Lumina logo" className="w-9 h-9" />

      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors"
          onMouseEnter={handleItemMouseEnter}
          onMouseLeave={handleItemMouseLeave}
        >
          Item One
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isItemDropdownOpen && (
          <div
            className="absolute top-full left-0 mt-1 bg-black border border-gray-700 rounded-md shadow-lg min-w-[150px] z-[9999]"
            onMouseEnter={handleItemMouseEnter}
            onMouseLeave={handleItemMouseLeave}
          >
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-800 text-white transition-colors border-b border-gray-700 last:border-b-0"
            >
              Link 1
            </a>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-800 text-white transition-colors border-b border-gray-700 last:border-b-0"
            >
              Link 2
            </a>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-800 text-white transition-colors border-b border-gray-700 last:border-b-0"
            >
              Link 3
            </a>
          </div>
        )}
      </div>

      <div className="relative">
        <Avatar
          className="cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AvatarImage src="" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        {isDropdownOpen && (
          <div
            className="absolute top-full right-0 mt-1 bg-black border border-gray-700 rounded-md shadow-lg min-w-[150px] z-[9999]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="#"
              className="block px-4 py-2 hover:bg-gray-800 text-white transition-colors border-b border-gray-700 last:border-b-0"
            >
              Login
            </Link>
            <Link
              href="#"
              className="block px-4 py-2 hover:bg-gray-800 text-white transition-colors border-b border-gray-700 last:border-b-0"
            >
              Signup
            </Link>
            {/* <Link
              href="#"
              className="block px-4 py-2 hover:bg-gray-800 text-red-500 transition-colors border-b border-gray-700 last:border-b-0"
            >
              Logout
            </Link> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default LuminaHeader;
