import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../contexts/ChatContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatWindow = () => {
  const { activeConversation } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2, 
        pb: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {activeConversation?.messages.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
            p: 3
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            AI Chatbot
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start a conversation by typing a message below.
          </Typography>
        </Box>
      ) : (
        activeConversation.messages.map((message) => (
          <Box 
            key={message.id} 
            sx={{ 
              display: 'flex', 
              mb: 2,
              alignItems: 'flex-start'
            }}
          >
            <Avatar 
              sx={{ 
                mr: 2, 
                bgcolor: message.role === 'assistant' ? 'primary.main' : 'secondary.main'
              }}
            >
              {message.role === 'assistant' ? 'AI' : 'You'}
            </Avatar>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                maxWidth: '80%',
                backgroundColor: message.error ? 'error.dark' : 'background.paper'
              }}
            >
              {/* Display any images */}
              {message.images && message.images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {message.images.map((img, index) => (
                    <Box 
                      key={index} 
                      component="img" 
                      src={img.dataUrl}
                      alt="Uploaded image"
                      sx={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px',
                        borderRadius: 1,
                        mb: 1
                      }}
                    />
                  ))}
                </Box>
              )}
              
              {/* Display text content */}
              {message.loading ? (
                <>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  <CircularProgress size={20} sx={{ ml: 1 }} />
                </>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </Paper>
          </Box>
        ))
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatWindow;
