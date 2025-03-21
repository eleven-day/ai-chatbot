import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ChatLayout from './components/ChatLayout';
import ApiService from './services/ApiService';
import { SettingsProvider } from './contexts/SettingsContext';
import { ChatProvider } from './contexts/ChatContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [apiService, setApiService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApi = async () => {
      setLoading(true);
      try {
        // Default settings if not in Electron environment
        let settings = {
          apiKey: '',
          baseUrl: 'https://api.openai.com',
          modelSettings: {
            model: 'gpt-4o',
            temperature: 0.7,
            maxTokens: 1000
          }
        };
        
        // If in Electron environment, get settings from main process
        if (window.api) {
          try {
            const storedSettings = await window.api.getSettings();
            if (storedSettings) {
              settings = storedSettings;
            }
          } catch (err) {
            console.error('Failed to get settings from Electron:', err);
            // Continue with default settings
          }
        }
        
        // Create API service with settings
        const service = new ApiService({
          apiKey: settings.apiKey || '',
          baseUrl: settings.baseUrl || 'https://api.openai.com',
          model: settings.modelSettings?.model || 'gpt-4o',
          temperature: settings.modelSettings?.temperature || 0.7,
          maxTokens: settings.modelSettings?.maxTokens || 1000
        });
        
        setApiService(service);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing API service:', err);
        setError('Failed to initialize application. Please restart the app.');
        setLoading(false);
      }
    };

    initializeApi();
  }, []);

  const theme = darkMode ? darkTheme : lightTheme;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'error.main',
        textAlign: 'center',
        p: 3
      }}>
        {error}
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsProvider apiService={apiService}>
        <ChatProvider apiService={apiService}>
          <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ChatLayout 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
            />
          </Box>
        </ChatProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
