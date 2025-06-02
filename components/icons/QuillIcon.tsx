import React from 'react';

interface IconProps {
  className?: string;
}

export const QuillIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    <path d="M20 16.58A5 5 0 0 1 16 22h-1.26A8 8 0 1 1 8 7.75" />
    <line x1="14" y1="8" x2="22" y2="16" />
    <line x1="8" y1="14" x2="16" y2="22" />
  </svg>
);
