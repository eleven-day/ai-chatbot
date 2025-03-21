# AI Chatbot

A modern desktop chatbot application built with Electron and React that interfaces with OpenAI and compatible API providers.

## Features

- 🎨 Modern UI with light/dark mode
- 💬 Chat with AI models using text and images
- 🌊 Streaming responses for a natural conversation experience
- 📷 Multi-modal support (text + images)
- 📝 Markdown rendering with syntax highlighting for code
- 📚 Conversation history management
- ⚙️ Configurable model settings (temperature, max tokens)
- 🔑 Custom API endpoints support

## Screenshots

[Screenshots will be added here]

## Installation

### Pre-built Binaries

Download the latest release from the [Releases](https://github.com/eleven-day/ai-chatbot/releases) page.

### Build from Source

1. Clone this repository
```bash
git clone https://github.com/eleven-day/ai-chatbot.git
cd ai-chatbot
```

2. Install dependencies
```bash
npm install
```

3. Run the application in development mode
```bash
npm start
```

4. Build the application
```bash
npm run package
```

The packaged application will be available in the `dist` directory.

## Usage

1. Launch the application
2. Configure your API key in the settings (top-right gear icon)
3. Select your preferred model and adjust settings
4. Start chatting!

### API Key

You'll need an API key from OpenAI or a compatible provider. The application supports:
- OpenAI API (default)
- Custom endpoints with OpenAI-compatible APIs

## Configuration

### Models

The application supports various LLM models:
- GPT-4o (default)
- O1 Mini
- Any compatible model through custom endpoints

### Settings

- **Temperature**: Controls randomness (0.0 to 2.0)
- **Max Tokens**: Controls maximum response length
- **Base URL**: API endpoint for custom providers

## Development

### Project Structure

```
chatbot/
├── electron/         # Electron main process
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── contexts/     # React contexts for state management
│   ├── services/     # API services
│   └── App.js        # Main React component
```

### Technologies

- Electron - Desktop application framework
- React - UI library
- Material-UI - Component library
- OpenAI API - AI backend

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2023 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Files/Directories to Exclude from Git

When uploading to GitHub, exclude the following files and directories:

```
# Dependencies
/node_modules

# Production build
/build
/dist

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.idea/
.vscode/
*.swp
*.swo

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# System Files
.DS_Store
Thumbs.db

# Electron store (contains user API keys)
config.json
```

Create a `.gitignore` file with these entries to automatically exclude them.
