import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', showIcon = true }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-200 min-h-touch ${
        language === 'gu'
          ? 'bg-gold/15 text-gold border-gold/40 hover:bg-gold/25'
          : 'bg-charcoal text-gray-200 border-gray-700 hover:border-gold/40 hover:text-gold'
      } ${className}`}
      aria-label="Toggle Language"
    >
      {showIcon && <Globe className="w-3.5 h-3.5 text-gold" />}
      <span className={language === 'en' ? 'text-gold font-bold' : 'text-gray-400'}>EN</span>
      <span className="text-gray-600">/</span>
      <span className={language === 'gu' ? 'text-gold font-bold' : 'text-gray-400'}>ગુજરાતી</span>
    </button>
  );
};
