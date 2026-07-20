'use client';

import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isDisabled }) => {
  const [value, setValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      if (selectedFile && value === selectedFile.name) {
        onSend(`Attached: ${selectedFile.name}`);
      } else {
        onSend(value);
      }
      setValue('');
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue(file.name);
    }
  };

  return (
    <div className="p-[14px_16px] bg-white border-none">
      <form onSubmit={handleSubmit} className="flex items-center gap-[12px]">
        <div
          className="flex p-[10px_14px] items-center gap-[10px] flex-[1_0_0] rounded-[6px] border border-[#E5E7EB] bg-[#EFF1F4] transition-all focus-within:border-[#9CA6BB]"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isDisabled}
            placeholder="Type your message..."
            className="w-full bg-transparent border-none p-0 text-[15px] leading-[140%] font-normal text-gray-800 placeholder:text-[#9CA6BB]/80 focus:outline-none focus:ring-0 disabled:opacity-50 font-['Open_Sans',_sans-serif]"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
          />
        </div>
        <button
          type="submit"
          disabled={isDisabled || !value.trim()}
          className="flex w-[42px] h-[42px] justify-center items-center rounded-[8px] bg-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:bg-black active:scale-95 disabled:bg-gray-300 disabled:shadow-none cursor-pointer flex-shrink-0"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
};
