import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children, apiService }) => {
  const [conversations, setConversations] = useState([
    { id: 'default', title: 'New Chat', messages: [] }
  ]);
  const [activeConversationId, setActiveConversationId] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId) || conversations[0];

  // Create a new conversation
  const createNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConversation = {
      id: newId,
      title: 'New Chat',
      messages: []
    };
    
    setConversations([...conversations, newConversation]);
    setActiveConversationId(newId);
    return newId;
  };

  // Delete a conversation
  const deleteConversation = (id) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    
    // If the deleted conversation was active, set the first available as active
    if (id === activeConversationId && updatedConversations.length > 0) {
      setActiveConversationId(updatedConversations[0].id);
    }
  };

  // Update conversation title
  const updateConversationTitle = (id, title) => {
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, title } : conv
    ));
  };

  // Send a message to the API and update the conversation
  const sendMessage = async (content, imageFiles = []) => {
    // Don't send empty messages
    if (!content.trim() && imageFiles.length === 0) return;
    
    // Create user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content,
      timestamp: new Date().toISOString(),
      images: imageFiles
    };
    
    // Add user message to the conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversationId) {
        // If this is the first message, update the title
        const shouldUpdateTitle = conv.messages.length === 0 && content.trim();
        
        return {
          ...conv,
          title: shouldUpdateTitle ? content.substring(0, 30) : conv.title,
          messages: [...conv.messages, userMessage]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Prepare the conversation history for the API
      const currentConversation = updatedConversations.find(conv => conv.id === activeConversationId);
      const history = currentConversation.messages.map(msg => ({
        role: msg.role,
        content: prepareMessageContent(msg)
      }));
      
      // Initialize the assistant message
      const assistantMessageId = `msg-${Date.now() + 1}`;
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        loading: true
      };
      
      // Add the empty assistant message to show it's loading
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        )
      );
      
      // Call the API with streaming
      await apiService.sendChatCompletion(
        history,
        // Chunk callback (for streaming)
        (chunk) => {
          setConversations(prevConversations => 
            prevConversations.map(conv => {
              if (conv.id === activeConversationId) {
                const updatedMessages = conv.messages.map(msg => 
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + chunk, loading: true }
                    : msg
                );
                return { ...conv, messages: updatedMessages };
              }
              return conv;
            })
          );
        },
        // Completion callback
        () => {
          setConversations(prevConversations => 
            prevConversations.map(conv => {
              if (conv.id === activeConversationId) {
                const updatedMessages = conv.messages.map(msg => 
                  msg.id === assistantMessageId
                    ? { ...msg, loading: false }
                    : msg
                );
                return { ...conv, messages: updatedMessages };
              }
              return conv;
            })
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the assistant message with the error
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === activeConversationId) {
            const updatedMessages = conv.messages.map(msg => 
              msg.id === assistantMessageId
                ? { 
                    ...msg, 
                    content: 'Error: Failed to get response. Please check your API settings and try again.',
                    error: true,
                    loading: false
                  }
                : msg
            );
            return { ...conv, messages: updatedMessages };
          }
          return conv;
        })
      );
      
      setIsLoading(false);
    }
  };
  
  // Helper function to prepare message content (text + images) for API
  const prepareMessageContent = (message) => {
    if (!message.images || message.images.length === 0) {
      return message.content;
    }
    
    // Create a multi-modal content array
    const contentArray = [];
    
    // Add text content
    if (message.content.trim()) {
      contentArray.push({
        type: 'text',
        text: message.content
      });
    }
    
    // Add image content
    message.images.forEach(image => {
      contentArray.push({
        type: 'image_url',
        image_url: {
          url: image.dataUrl
        }
      });
    });
    
    return contentArray;
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversationId,
      activeConversation,
      isLoading,
      setActiveConversationId,
      createNewConversation,
      deleteConversation,
      updateConversationTitle,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
