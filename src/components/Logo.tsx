
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-mindease h-8 w-8"
      >
        <path d="M14 19a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h11Z" />
        <path d="M14 13V8a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v5" />
        <path d="M9 17v2" />
        <path d="M9 5v2" />
        <path d="M22 19v-9a4 4 0 0 0-4-4h-2" />
        <path d="M16 19h3a3 3 0 0 0 0-6h-3" />
      </svg>
      <span className="ml-2 font-semibold text-lg text-mindease dark:text-white">Mindease</span>
    </div>
  );
};

export default Logo;
