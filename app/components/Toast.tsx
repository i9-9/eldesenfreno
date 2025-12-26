'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation before removing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = 
    type === 'success' ? 'bg-[#2C2C2C] bg-opacity-10 border border-white border-opacity-20 backdrop-blur-lg shadow-lg font-neue-display' : 
    type === 'error' ? 'bg-[#2C2C2C] bg-opacity-10 border border-red-500 border-opacity-40 backdrop-blur-lg shadow-lg' : 
    'bg-[#2C2C2C] bg-opacity-10 border border-white border-opacity-20 backdrop-blur-lg shadow-lg';

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg ${bgColor} text-white flex items-center transition-all duration-300 ${isVisible ? 'opacity-80' : 'opacity-0'}`}
    >
      <div className="mr-3">
        {type === 'success' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === 'error' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {type === 'info' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <p>{message}</p>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-4 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default Toast; 