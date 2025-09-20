import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translate = (key, fallback = null) => {
    try {
      const translation = translations[language]?.[key];
      if (translation) {
        return translation;
      }
      
      // Fallback to English if current language doesn't have the key
      const englishTranslation = translations['en']?.[key];
      if (englishTranslation) {
        console.warn(`Translation key "${key}" not found in ${language}, using English fallback`);
        return englishTranslation;
      }
      
      // If no translation found, return fallback or key
      console.warn(`Translation key "${key}" not found in any language`);
      return fallback || key;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return fallback || key;
    }
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    } else {
      console.error(`Language "${newLanguage}" not supported`);
    }
  };

  return (
    <TranslationContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage,
      translate,
      availableLanguages: Object.keys(translations),
      translations // Expose all translations if needed
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
