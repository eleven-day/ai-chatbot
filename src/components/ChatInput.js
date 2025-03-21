import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';
import { useChat } from '../contexts/ChatContext';

const ChatInput = () => {
  const { sendMessage, isLoading } = useChat();
  const [inputText, setInputText] = useState('');
  const [images, setImages] = useState([]);

  const handleSend = () => {
    if ((inputText.trim() || images.length > 0) && !isLoading) {
      sendMessage(inputText, images);
      setInputText('');
      setImages([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = async () => {
    // For Electron, use the exposed API
    if (window.api) {
      const result = await window.api.selectImage();
      if (result) {
        setImages([...images, result]);
      }
    } else {
      // For web browser, use file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImages([...images, {
              path: file.name,
              dataUrl: event.target.result
            }]);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Display selected images */}
      {images.length > 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            mb: 2, 
            p: 1, 
            borderRadius: 1, 
            bgcolor: 'background.paper' 
          }}
        >
          {images.map((img, index) => (
            <Box 
              key={index} 
              sx={{ 
                position: 'relative', 
                width: 100, 
                height: 100 
              }}
            >
              <Box 
                component="img" 
                src={img.dataUrl}
                alt="Selected image"
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
              <IconButton
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  }
                }}
                onClick={() => removeImage(index)}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Text input and buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          sx={{ flexGrow: 1 }}
        />
        <IconButton 
          color="primary" 
          onClick={handleImageUpload}
          disabled={isLoading}
        >
          <AttachFileIcon />
        </IconButton>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={(!inputText.trim() && images.length === 0) || isLoading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInput;
