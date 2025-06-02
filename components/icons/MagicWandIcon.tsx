
import React from 'react';

interface IconProps {
  className?: string;
}

export const MagicWandIcon: React.FC<IconProps> = ({ className }) => (
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
    <path d="M15 4V2" />
    <path d="M15 8V6" />
    <path d="M12.5 6.5L14 5" />
    <path d="M10 8L15 3" />
    <path d="M17.5 8.5L16 7" />
    <path d="M9 4V2" />
    <path d="M9 8V6" />
    <path d="M7.5 6.5L6 5" />
    <path d="M14 8L9 3" />
    <path d="M6.5 8.5L8 7" />
    <path d="M21 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-9 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-9 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    <path d="M3 12v7.5L7.5 22H16.5L21 19.5V12" />
  </svg>
);
