import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSettings } from '../contexts/SettingsContext';

const ApiSettings = ({ open, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  // Load current settings when dialog opens
  useEffect(() => {
    if (open) {
      setApiKey(settings.apiKey || '');
      setBaseUrl(settings.baseUrl || 'https://api.openai.com');
    }
  }, [open, settings]);

  const handleSave = () => {
    updateSettings({
      apiKey,
      baseUrl: baseUrl || 'https://api.openai.com'
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>API Settings</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="API Key"
          type="password"
          fullWidth
          variant="outlined"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          helperText="Your OpenAI API key or compatible API key"
          sx={{ mb: 2, mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Base URL"
          fullWidth
          variant="outlined"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          helperText="Default: https://api.openai.com"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiSettings;
