import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition focus:outline-none"
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-3 text-blue-500" />}
          <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        </div>
        <ChevronDown
          size={24}
          className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ transition: 'max-height 0.7s ease-in-out, padding 0.5s ease, opacity 0.5s ease' }}
      >
        <div className="p-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}
