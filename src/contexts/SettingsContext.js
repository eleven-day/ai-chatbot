import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children, apiService }) => {
  const [settings, setSettings] = useState({
    apiKey: '',
    baseUrl: 'https://api.openai.com',
    modelSettings: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1000
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (window.api) {
        const storedSettings = await window.api.getSettings();
        setSettings(storedSettings);
        
        // Update API service with loaded settings
        if (apiService) {
          apiService.updateConfig({
            apiKey: storedSettings.apiKey,
            baseUrl: storedSettings.baseUrl,
            ...storedSettings.modelSettings
          });
        }
      }
    };

    loadSettings();
  }, [apiService]);

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Update API service with new settings
    if (apiService) {
      apiService.updateConfig({
        apiKey: updatedSettings.apiKey,
        baseUrl: updatedSettings.baseUrl,
        ...updatedSettings.modelSettings
      });
    }
    
    // Save settings if in Electron environment
    if (window.api) {
      await window.api.saveSettings(updatedSettings);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
