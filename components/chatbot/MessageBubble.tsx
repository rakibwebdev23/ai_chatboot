'use client';

import React from 'react';
import Image from 'next/image';

interface MessageBubbleProps {
  role: 'user' | 'bot';
  text: string | React.ReactNode;
  avatar?: string;
  urls?: Record<string, string>;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, text, avatar, urls }) => {
  const isBot = role === 'bot';
  const isFile = typeof text === 'string' && text.startsWith('Attached:');
  const isComponent = typeof text !== 'string';
  const fileName = isFile ? (text as string).replace('Attached: ', '') : '';

  // Parse sources if it's a string from the bot
  const renderContent = () => {
    if (typeof text !== 'string') return text;

    if (isFile) {
      return (
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <div className="flex flex-col">
            <span className="text-[11px] opacity-70">Attached File:</span>
            <span className="font-semibold break-all text-[14px]">{fileName}</span>
          </div>
        </div>
      );
    }

    // Helper to get formatted title and domain from URL
    const getUrlDetails = (linkStr: string) => {
      try {
        const url = new URL(linkStr);
        const domain = url.hostname.replace('www.', '');
        const segments = url.pathname.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1] || '';
        if (lastSegment) {
          const title = lastSegment
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return { title, domain };
        }
        return { title: domain, domain };
      } catch {
        return { title: 'Link', domain: 'link' };
      }
    };

    const formatTitle = (str: string) => {
      return str
        .split(/[-_\s]/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    let linksToRender: { title: string; link: string }[] = [];

    if (urls && Object.keys(urls).length > 0) {
      linksToRender = Object.entries(urls).map(([key, value]) => ({
        title: formatTitle(key),
        link: value
      }));
    } else {
      // Fallback: Split by "Sources:" if it exists
      const parts = text.split(/Sources:/i);
      const sourcesPart = parts[1] || "";
      const matches = sourcesPart.match(/https?:\/\/[^\s\n]+/g) || [];
      if (matches.length > 0) {
        const rawLinks = matches.map(link => link.replace(/[.,;)]+$/, ''));
        const uniqueLinks = Array.from(new Set(rawLinks));
        linksToRender = uniqueLinks.map(link => {
          const { title } = getUrlDetails(link);
          return { title, link };
        });
      }
    }

    const mainText = text.split(/Sources:/i)[0].trim();

    return (
      <div className="flex flex-col gap-3 w-full min-w-0">
        <div className="whitespace-pre-wrap break-words">{mainText}</div>
        {linksToRender.length > 0 && (
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100 w-full min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Our Services: </span>
            <div className="flex flex-col gap-3 w-full min-w-0">
              {linksToRender.map((item, i) => (
                <div key={i} className="flex flex-col gap-1 w-full min-w-0">
                  <span className="text-[13px] font-semibold text-gray-800 break-words">
                    {item.title}
                  </span>
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#3093E4] hover:text-[#2185D0] hover:underline transition-colors break-all w-full min-w-0"
                  >
                    {item.link}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex w-full mb-3 md:mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[90%] items-end ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div 
          className={`flex-shrink-0 w-[32px] h-[32px] rounded-full overflow-hidden ${isBot ? 'mr-3' : 'ml-2'}`}
          style={{ aspectRatio: '1/1' }}
        >
          <Image 
            src={isBot ? '/images/chat-icon.png' : (avatar || '/images/profile.png')} 
            alt={role} 
            width={32} 
            height={32} 
            className="object-cover w-full h-full shadow-sm"
          />
        </div>

        {/* Bubble */}
        <div 
          className={`flex flex-col gap-1 transition-all min-w-0 max-w-full overflow-hidden ${
            isBot 
              ? `p-[12px_16px] ${isComponent ? 'rounded-xl' : 'rounded-[16px_16px_16px_4px]'} bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100` 
              : 'p-[12px_18px] rounded-[18px_18px_4px_18px] bg-[#3093E4] shadow-[0_2px_8px_rgba(48,147,228,0.25)]'
          }`}
        >
          <div 
            className={`break-words max-w-full ${
              isBot 
                ? 'text-[#292E38] text-[15px] leading-[160%] font-normal' 
                : 'text-white text-[15px] leading-[150%] font-normal'
            }`}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

