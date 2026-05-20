import { useState, useEffect } from 'react';

const messages = [
  '일기를 읽고 있어...',
  '오늘 하루를 느끼는 중...',
  '어울리는 음악을 찾고 있어...',
];

export default function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showExtra, setShowExtra] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowExtra(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping" />
        <div className="absolute inset-2 rounded-full border-4 border-indigo-400 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-indigo-500 animate-bounce" />
      </div>
      <p className="text-gray-600 text-lg transition-all duration-500">
        {messages[messageIndex]}
      </p>
      {showExtra && (
        <p className="text-gray-400 text-sm mt-2 animate-fade-in">
          조금만 기다려줘 ✨
        </p>
      )}
    </div>
  );
}
