const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const fs = require('fs');
const url = require('url');

// Debug logging for production builds
console.log('App starting from:', __dirname);
console.log('App path:', app.getAppPath());
console.log('User data path:', app.getPath('userData'));

// Initialize the settings store
const store = new Store();

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.ico')
  });

  // Load the app
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  console.log('Loading URL:', startUrl);
  
  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Failed to load URL:', err);
    
    // Fallback attempt for packaged apps
    if (!process.env.ELECTRON_START_URL) {
      const fallbackPath = path.join(app.getAppPath(), 'build/index.html');
      console.log('Trying fallback path:', fallbackPath);
      
      mainWindow.loadFile(fallbackPath).catch(err2 => {
        console.error('Fallback load also failed:', err2);
        mainWindow.webContents.loadURL('data:text/html,<h1>Failed to load application</h1><p>Please reinstall the application</p>');
      });
    }
  });

  // Open DevTools in development mode
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// IPC handlers for settings
ipcMain.handle('get-settings', async (event) => {
  return {
    apiKey: store.get('apiKey', ''),
    baseUrl: store.get('baseUrl', 'https://api.openai.com'),
    modelSettings: store.get('modelSettings', {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1000
    })
  };
});

ipcMain.handle('save-settings', async (event, settings) => {
  for (const key in settings) {
    store.set(key, settings[key]);
  }
  return true;
});

// IPC handler for selecting image files
ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const filePath = result.filePaths[0];
      const buffer = fs.readFileSync(filePath);
      const base64Image = buffer.toString('base64');
      const fileExtension = path.extname(filePath).substring(1);
      
      return {
        path: filePath,
        dataUrl: `data:image/${fileExtension};base64,${base64Image}`
      };
    } catch (error) {
      console.error('Error reading image file:', error);
      return null;
    }
  }
  return null;
});
