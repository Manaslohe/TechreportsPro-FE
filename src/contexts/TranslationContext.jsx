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

  const translate = (key, values = {}, fallback = null) => {
    try {
      let translation = translations[language]?.[key];
      if (!translation) {
        // Fallback to English if current language doesn't have the key
        translation = translations['en']?.[key];
        if (!translation) {
          console.warn(`Translation key "${key}" not found in any language`);
          return fallback || key;
        }
      }

      // Replace placeholders with dynamic values
      if (values && typeof values === 'object') {
        Object.keys(values).forEach((placeholder) => {
          translation = translation.replace(`{${placeholder}}`, values[placeholder]);
        });
      }

      return translation;
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
