class ApiService {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || '',
      baseUrl: config.baseUrl || 'https://api.openai.com',
      model: config.model || 'gpt-4o',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 1000
    };
  }

  // Update configuration (e.g., when settings change)
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Send chat completion request with streaming
  async sendChatCompletion(messages, onChunk, onComplete) {
    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    const endpoint = `${this.config.baseUrl}/v1/chat/completions`;
    
    // Prepare request body
    const body = {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: true
    };

    try {
      // Create fetch request with streaming
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.error?.message || errorMessage;
        } catch (e) {
          // If we can't parse the error, just use the status
        }
        throw new Error(errorMessage);
      }

      // Set up the stream reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk
        const chunk = decoder.decode(value);
        buffer += chunk;
        
        // Process each line in the buffer
        let lines = buffer.split('\n');
        buffer = lines.pop() || '';  // Keep the last incomplete line in the buffer

        for (const line of lines) {
          // Skip empty lines or [DONE]
          if (!line.trim() || line.includes('[DONE]')) continue;
          
          // Remove "data: " prefix
          const data = line.replace(/^data: /, '').trim();
          if (!data) continue;
          
          try {
            const json = JSON.parse(data);
            // Extract content from delta
            const content = json.choices?.[0]?.delta?.content || '';
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing JSON from stream:', e);
          }
        }
      }

      // Call the complete callback
      onComplete();
      
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Send non-streaming request for multi-modal inputs
  async sendMultiModalRequest(messages) {
    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    const endpoint = `${this.config.baseUrl}/v1/chat/completions`;
    
    // Prepare request body
    const body = {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: false
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.error?.message || errorMessage;
        } catch (e) {
          // If we can't parse the error, just use the status
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

export default ApiService;
