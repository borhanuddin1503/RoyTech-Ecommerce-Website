'use client'
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Mail, User as UserIcon, ChevronDown } from "lucide-react";
import { signOut } from 'next-auth/react';
import { FaRegUser } from 'react-icons/fa';

const Popup = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block"
      ref={popupRef}
    >
      {/* Profile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
      >
        <div className="w-8 h-8 bg-main text-white rounded-full flex items-center justify-center text-sm font-semibold">
          <FaRegUser className="w-4 h-4" />
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Popup Menu */}
      <div
        className={`absolute right-0 top-[calc(100%+8px)] mt-2 min-w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-4 text-gray-700 z-50
          transition-all duration-200 ease-out
          ${isOpen 
            ? "opacity-100 visible translate-y-0 scale-100" 
            : "opacity-0 invisible translate-y-2 scale-95"
          }`}
      >
        {/* User Info Section */}
        <div className="flex items-start gap-3 pb-3 mb-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-main text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm">
              {user?.name || "User"}
            </p>
            <p className="text-gray-500 text-xs truncate flex items-center gap-1 mt-1">
              <Mail size={12} />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-700 font-medium transition-all duration-200 cursor-pointer border border-gray-200 hover:border-red-200 group"
        >
          <LogOut size={16} className="group-hover:text-red-600" />
          <span className="group-hover:text-red-600">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Popup;