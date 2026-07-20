/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { MessageBubble } from '@/components/chatbot/MessageBubble';
import { ChatWindow } from '@/components/chatbot/ChatWindow';
import { QuickReplies } from '@/components/chatbot/QuickReplies';
import { ContactForm } from '@/components/chatbot/ContactForm';
import { TypingIndicator } from '@/components/chatbot/TypingIndicator';
import { ChatInput } from '@/components/chatbot/ChatInput';
import { getMessages, createMessage } from '@/api/api';

interface Message {
  role: 'user' | 'bot';
  text: string | React.ReactNode;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [ids] = useState(() => {
    if (typeof window === 'undefined') return { userID: "1", threadID: "1" };
    const savedUser = localStorage.getItem('chat_user_id') || "user-" + Math.random().toString(36).substring(7);
    const savedThread = localStorage.getItem('chat_thread_id') || "thread-" + Math.random().toString(36).substring(7);
    localStorage.setItem('chat_user_id', savedUser);
    localStorage.setItem('chat_thread_id', savedThread);
    return { userID: savedUser, threadID: savedThread };
  });

  const handleFormSubmit = async (formData: any) => {
    setIsTyping(true);
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
      setIsTyping(false);
    }
  };


  const processResponse = (data: any) => {
    setIsTyping(false);
    if (data.reply) {
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    }
    if (data.action?.type === 'lead_form') {
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: <ContactForm onSubmit={handleFormSubmit} />
      }]);
    }
  };



  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getMessages(ids.threadID);
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages
            .filter((m: any) => typeof m.content === 'string') // Only keep string messages
            .map((m: any) => ({
              role: m.role === 'assistant' ? 'bot' : 'user',
              text: m.content
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
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setIsTyping(true);
    try {
      const response = await createMessage({ userID: ids.userID, threadID: ids.threadID, message: text });
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex flex-col p-[18px] bg-[#0A2540] text-white">
          <h2 className="text-[20px] font-semibold">APS Security Assistant</h2>
          <span className="text-[12px] opacity-80">Online Now</span>
        </div>

        {/* Chat Window */}
        <ChatWindow>
          {messages.map((msg, index) => (
            <MessageBubble key={index} role={msg.role} text={msg.text} />
          ))}
          {isTyping && <TypingIndicator />}
        </ChatWindow>

        {/* Quick Replies */}
        {messages.length === 0 && !isTyping && (
          <div className="px-2">
            <QuickReplies options={quickOptions} onSelect={handleSendMessage} />
          </div>
        )}
        <ChatInput onSend={handleSendMessage} isDisabled={isTyping} />
      </div>
    </main>
  );
}
