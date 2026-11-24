import React, { createContext, useContext, ReactNode } from 'react';
import enTranslations from './translations/en.json';

interface LanguageContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = enTranslations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
        return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramVal));
      }, result);
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
