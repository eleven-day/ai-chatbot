import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useSettings } from '../contexts/SettingsContext';

const ModelSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { modelSettings } = settings;

  const handleModelChange = (event) => {
    updateSettings({
      modelSettings: {
        ...modelSettings,
        model: event.target.value
      }
    });
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

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Model Settings
      </Typography>
      
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          value={modelSettings.model}
          label="Model"
          onChange={handleModelChange}
        >
          <MenuItem value="gpt-4o">GPT-4o</MenuItem>
          <MenuItem value="o1-mini">O1 Mini</MenuItem>
        </Select>
      </FormControl>
      
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
