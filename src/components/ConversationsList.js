import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useChat } from '../contexts/ChatContext';

const ConversationsList = () => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    createNewConversation,
    deleteConversation
  } = useChat();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 1 }}>
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<AddIcon />}
          onClick={createNewConversation}
        >
          New Chat
        </Button>
      </Box>
      
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            disablePadding
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conversation.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton 
              selected={activeConversationId === conversation.id}
              onClick={() => setActiveConversationId(conversation.id)}
            >
              <ListItemText 
                primary={conversation.title || 'New Chat'} 
                primaryTypographyProps={{
                  noWrap: true,
                  title: conversation.title
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ConversationsList;
