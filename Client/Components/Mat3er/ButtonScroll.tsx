"use client";

import React, { useEffect, useState } from "react";

const ButtonScroll = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const checkScrollPosition = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const isAtBottom = scrollPosition >= document.documentElement.scrollHeight - 100;
    setIsAtBottom(isAtBottom);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  return (
    <button
      onClick={isAtBottom ? scrollToTop : scrollToBottom}
      className="fixed bottom-32 right-3 p-3 bg-[var(--color-matg3er)] text-white rounded-full shadow-lg hover:bg-[var(--color-matg3er-rgb)] transition"
      aria-label={isAtBottom ? "Scroll to Top" : "Scroll Down"}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isAtBottom ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 15l7-7 7 7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        )}
      </svg>
    </button>
  );
};

export default ButtonScroll;
