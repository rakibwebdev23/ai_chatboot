'use client';

import React from 'react';

interface QuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-col gap-[8px] mb-4 pl-[46px] pr-4 items-start">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className="p-[8px_16px] bg-white border border-[#E5E7EB] text-[#1A1A1A] text-[15px] leading-[150%] font-semibold rounded-[10px] hover:bg-gray-50 active:scale-95 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1)] cursor-pointer text-left font-['Open_Sans',_sans-serif]"
        >
          {option}
        </button>
      ))}
    </div>
  );
};
