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
      className={`bg-obsidian-card rounded-2xl border transition-all duration-300 p-6 shadow-card-glow ${
        highlighted
          ? 'border-champagne/70 shadow-luxury-glow ring-1 ring-champagne/30'
          : 'border-obsidian-border hover:border-champagne/30'
      } ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-luxury cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
