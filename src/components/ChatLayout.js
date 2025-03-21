import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';

import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ModelSettings from './ModelSettings';
import ApiSettings from './ApiSettings';
import { useChat } from '../contexts/ChatContext';

const DRAWER_WIDTH = 280;

const ChatLayout = ({ darkMode, setDarkMode }) => {
  const { activeConversation } = useChat();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {/* Top App Bar */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {activeConversation?.title || 'New Chat'}
          </Typography>
          <IconButton onClick={() => setSettingsOpen(true)} color="inherit">
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { sm: DRAWER_WIDTH },
            flexShrink: { sm: 0 },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                position: 'relative',
                height: '100%'
              },
            }}
            open
          >
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
              <ConversationsList />
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <ModelSettings />
            </Box>
          </Drawer>
        </Box>

        {/* Chat Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Messages area */}
          <ChatWindow />
          
          {/* Input area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <ChatInput />
          </Box>
        </Box>
      </Box>

      {/* API Settings Dialog */}
      <ApiSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default ChatLayout;
