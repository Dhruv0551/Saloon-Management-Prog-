import React, { ReactNode } from 'react';

interface ThemeCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  highlighted?: boolean;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  highlighted = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-charcoal rounded-2xl border transition-all duration-200 p-5 ${
        highlighted
          ? 'border-gold shadow-[0_0_20px_rgba(212,160,23,0.25)]'
          : 'border-gray-800'
      } ${
        hoverEffect ? 'hover:border-gold/60 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
