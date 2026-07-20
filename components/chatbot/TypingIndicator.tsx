'use client';

import React from 'react';
import Image from 'next/image';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-4 md:mb-6 justify-start items-end">
      <div className="flex-shrink-0 w-[32px] h-[32px] rounded-full overflow-hidden mr-3">
        <Image src="/images/chat-icon.png" alt="Bot" width={32} height={32} />
      </div>
      <div 
        className="bg-white p-[12px_16px] rounded-[16px_16px_16px_4px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center min-w-[60px]"
      >
        <span className="italic text-[#9CA6BB] font-normal leading-[150%] text-[16px] flex items-end">
          thinking
          <span className="animate-bounce [animation-delay:0s] ml-1">.</span>
          <span className="animate-bounce [animation-delay:0.1s]">.</span>
          <span className="animate-bounce [animation-delay:0.2s]">.</span>
          <span className="animate-bounce [animation-delay:0.3s]">.</span>
          <span className="animate-bounce [animation-delay:0.4s]">.</span>
          <span className="animate-bounce [animation-delay:0.5s]">.</span>
        </span>
      </div>
    </div>
  );
};
