import React, { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useSettings } from '../contexts/SettingsContext';

const ModelSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { modelSettings } = settings;
  const [customModel, setCustomModel] = useState('');

  const handleModelChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'custom') {
      // If custom is selected, don't update the model yet
      return;
    }
    
    updateSettings({
      modelSettings: {
        ...modelSettings,
        model: selectedValue
      }
    });
  };

  const handleCustomModelChange = (event) => {
    setCustomModel(event.target.value);
  };

  const handleCustomModelBlur = () => {
    if (customModel.trim()) {
      updateSettings({
        modelSettings: {
          ...modelSettings,
          model: customModel.trim()
        }
      });
    }
  };

  const handleTemperatureChange = (event, newValue) => {
    updateSettings({
      modelSettings: {
        ...modelSettings,
        temperature: newValue
      }
    });
  };

  const handleMaxTokensChange = (event, newValue) => {
    updateSettings({
      modelSettings: {
        ...modelSettings,
        maxTokens: newValue
      }
    });
  };

  // Check if current model is one of the presets
  const isCustomModel = ![
    'chatgpt-4o-latest', 
    'claude-3-7-sonnet-20250219', 
    'gpt-4o-all', 
    'o1-mini', 
    'gemini-1.5-pro'
  ].includes(modelSettings.model);

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Model Settings
      </Typography>
      
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          value={isCustomModel ? 'custom' : modelSettings.model}
          label="Model"
          onChange={handleModelChange}
        >
          <MenuItem value="chatgpt-4o-latest">ChatGPT-4o-latest</MenuItem>
          <MenuItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</MenuItem>
          <MenuItem value="gpt-4o-all">GPT-4o-all</MenuItem>
          <MenuItem value="o1-mini">O1 Mini</MenuItem>
          <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
          <MenuItem value="custom">Custom Model</MenuItem>
        </Select>
      </FormControl>
      
      {isCustomModel && (
        <TextField
          fullWidth
          size="small"
          label="Custom Model Name"
          value={customModel || modelSettings.model}
          onChange={handleCustomModelChange}
          onBlur={handleCustomModelBlur}
          sx={{ mb: 2 }}
        />
      )}
      
      <Typography variant="body2" gutterBottom>
        Temperature: {modelSettings.temperature.toFixed(1)}
      </Typography>
      <Slider
        size="small"
        value={modelSettings.temperature}
        min={0}
        max={2}
        step={0.1}
        onChange={handleTemperatureChange}
        aria-labelledby="temperature-slider"
        sx={{ mb: 2 }}
      />
      
      <Typography variant="body2" gutterBottom>
        Max Tokens: {modelSettings.maxTokens}
      </Typography>
      <Slider
        size="small"
        value={modelSettings.maxTokens}
        min={100}
        max={4000}
        step={100}
        onChange={handleMaxTokensChange}
        aria-labelledby="max-tokens-slider"
      />
    </Box>
  );
};

export default ModelSettings;
