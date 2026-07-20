'use client';

import React, { useState, useEffect } from 'react';

interface ResetChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assistantName?: string;
}

export const ResetChatDialog: React.FC<ResetChatDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  assistantName = 'APS Security Assistant',
}) => {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }

  useEffect(() => {
    if (!isAnimating && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // matches fade-out duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[4px] ${isAnimating ? 'animate-fade-in' : 'animate-fade-out'}`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(24px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(24px) scale(0.95);
            opacity: 0;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 0.2s ease-in forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-slide-down {
          animation: slideDown 0.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .hover-fill-btn {
          position: relative;
          overflow: hidden;
          z-index: 0;
          transition: all 0.3s ease;
        }
        .hover-fill-btn::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 0;
          z-index: -1;
          transition: height 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .hover-fill-btn:hover::after {
          height: 100%;
        }
        .btn-keep-chatting {
          border: 1px solid #E5E7EB;
          color: #374151;
          transition: color 0.3s ease;
        }
        .btn-keep-chatting::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background-color: #F9FAFB;
          z-index: -2;
        }
        .btn-keep-chatting::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 0;
          background-color: #111827;
          z-index: -1;
          transition: height 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .btn-keep-chatting:hover::after {
          height: 100%;
        }
        .btn-keep-chatting:hover {
          color: #FFFFFF;
        }
        .btn-start-new {
          border: 1px solid #111827;
          color: #FFFFFF;
          transition: color 0.3s ease;
        }
        .btn-start-new::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background-color: #111827;
          z-index: -2;
        }
        .btn-start-new::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 0;
          background-color: #FFFFFF;
          z-index: -1;
          transition: height 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .btn-start-new:hover::after {
          height: 100%;
        }
        .btn-start-new:hover {
          color: #111827;
        }
      `}</style>

      <div className={`w-full max-w-[340px] bg-white rounded-[20px] p-6 shadow-2xl flex flex-col items-center text-center transform scale-100 transition-transform duration-200 ${isAnimating ? 'animate-slide-up' : 'animate-slide-down'}`}>
        {/* Purple Circle Icon */}
        <div className="w-14 h-14 rounded-full bg-[#ECEBF9] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-[19px] font-semibold text-gray-900 mb-2 tracking-tight">
          Start a new chat?
        </h3>

        {/* Description */}
        <p className="text-[13px] text-gray-500 leading-relaxed mb-6 px-1">
          This will clear your current conversation with {assistantName}, including anything {"you've"} shared. You {"can't"} undo this.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className="hover-fill-btn btn-keep-chatting flex-1 py-2 px-4 rounded-[10px] font-semibold text-sm active:scale-95 transition-all cursor-pointer"
          >
            Keep chatting
          </button>
          <button
            onClick={onConfirm}
            className="hover-fill-btn btn-start-new flex-1 py-2 px-4 rounded-[10px] font-semibold text-sm active:scale-95 transition-all cursor-pointer"
          >
            Start new chat
          </button>
        </div>
      </div>
    </div>
  );
};
