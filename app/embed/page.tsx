/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { MessageBubble } from '@/components/chatbot/MessageBubble';
import { ChatWindow } from '@/components/chatbot/ChatWindow';
import { QuickReplies } from '@/components/chatbot/QuickReplies';
import { TypingIndicator } from '@/components/chatbot/TypingIndicator';
import { ContactForm } from '@/components/chatbot/ContactForm';
import { ChatInput } from '@/components/chatbot/ChatInput';
import { ResetChatDialog } from '@/components/chatbot/ResetChatDialog';
import Image from 'next/image';
import { getMessages, createMessage, deleteChatHistory } from '@/api/api';

interface Message {
  role: 'user' | 'bot';
  text: string | React.ReactNode;
  urls?: Record<string, string>;
}

export default function EmbedChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  // IDs persistence
  const [ids] = useState(() => {
    if (typeof window === 'undefined') return { userID: "1", threadID: "1" };
    const savedUser = localStorage.getItem('chat_user_id') || "user-" + Math.random().toString(36).substring(7);
    const savedThread = localStorage.getItem('chat_thread_id') || "thread-" + Math.random().toString(36).substring(7);
    localStorage.setItem('chat_user_id', savedUser);
    localStorage.setItem('chat_thread_id', savedThread);
    return { userID: savedUser, threadID: savedThread };
  });

  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleStartNewChat = async () => {
    setMessages([]);
    setShowResetDialog(false);
    try {
      await deleteChatHistory(ids.threadID);
    } catch (error) {
      console.error("Failed to delete chat history:", error);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await createMessage({
        userID: ids.userID,
        threadID: ids.threadID,
        message: "form_submission",
        leadFormData: {
          first_name: formData.firstName || "",
          last_name: formData.lastName || "",
          contuct_number: formData.phone || "",
          email_address: formData.email || "",
          service_address: formData.address || "",
          messege: formData.message || ""
        }
      });
      processResponse(response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  const processResponse = (data: any) => {
    setIsTyping(false);
    if (data.reply) {
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        text: data.reply,
        urls: data.urls
      }]);
    }

    if (data.action?.type === 'lead_form') {
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: <ContactForm onSubmit={handleFormSubmit} />
      }]);
    }
  };
  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getMessages(ids.threadID);
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages
            .filter((m: any) => typeof m.content === 'string')
            .map((m: any) => ({
              role: m.role === 'assistant' ? 'bot' : 'user',
              text: m.content,
              urls: m.urls
            })));
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();
  }, [ids.threadID]);


  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await createMessage({
        userID: ids.userID,
        threadID: ids.threadID,
        message: text
      });
      processResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  const quickOptions = [
    "Get a Quote",
    "Speak to Management",
    "Book a Consultation"
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ background: '#EEF2F5' }}>

      {/* ── HEADER ── */}
      <div
        className="flex-shrink-0 flex flex-col px-[18px] pt-[14px] pb-[14px] gap-[10px] relative"
        style={{ background: '#0A2540' }}
      >
        {/* Row 1 – Logo + Close */}
        <div className="flex items-center justify-between w-full">
          <div className="relative h-[32px] w-[110px]">
            <Image
              src="/images/logo.png"
              alt="APS Logo"
              fill
              className="object-contain object-left"
            />
          </div>

          {/* Red close button – top right */}
          <button
            onClick={() => window.parent.postMessage('close_chatbot', '*')}
            className="w-[30px] h-[30px] bg-[#E20000] rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0"
            aria-label="Close chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Row 2 – Title + Online Status (single row, no wrapping) */}
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-[8px] min-w-0">
            <h2
              className="text-white font-semibold whitespace-nowrap truncate"
              style={{
                fontSize: '18px',
                lineHeight: '150%'
              }}
            >
              APS Security Assistant
            </h2>
            <div className="flex-shrink-0 w-[22px] h-[22px] bg-[#3B82F6] rounded-full flex items-center justify-center border border-white/20 overflow-hidden">
              <Image src="/images/chat-icon.png" alt="Bot" width={15} height={15} className="object-contain" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-[5px] flex-shrink-0">
              <span className="w-[7px] h-[7px] rounded-full bg-[#2ED94D] animate-pulse"></span>
              <span
                className="text-white/90 font-normal whitespace-nowrap"
                style={{ fontSize: '12px' }}
              >
                Online Now
              </span>
            </div>
            <button
              onClick={() => setShowResetDialog(true)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white/90 hover:text-white cursor-pointer"
              aria-label="Start a new chat"
              title="Start a new chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── CHAT MESSAGES ── */}
      <ChatWindow>
        {messages.map((msg, index) => (
          <div key={index}>
            <MessageBubble role={msg.role} text={msg.text} urls={msg.urls} />
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </ChatWindow>

      {/* ── QUICK REPLIES ── */}
      {messages.length === 0 && !isTyping && (
        <div style={{ background: '#EEF2F5' }}>
          <QuickReplies
            options={quickOptions}
            onSelect={handleSendMessage}
          />
        </div>
      )}

      {/* ── INPUT ── */}
      <div className="flex-shrink-0 bg-white">
        <ChatInput onSend={handleSendMessage} isDisabled={isTyping} />
      </div>

      {/* ── DIALOG OVERLAY ── */}
      <ResetChatDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleStartNewChat}
        assistantName="APS Security Assistant"
      />

    </div>
  );
}

