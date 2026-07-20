'use client';

import React, { useEffect, useRef } from 'react';

interface ChatWindowProps {
  children: React.ReactNode;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
    >
      {children}
    </div>
  );
};
