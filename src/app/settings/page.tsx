'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { ThemeNameContext } from '@/components/layout/Providers';
import type { ThemeName } from '@/lib/theme';

export default function SettingsPage() {
  const ctx = React.useContext(ThemeNameContext);
  if (!ctx) return null;

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as ThemeName; // SelectChangeEvent value is always string
    ctx.setThemeName(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      <FormControl sx={{ minWidth: 240 }}>
        <InputLabel id="theme-select-label">Theme</InputLabel>
        <Select
          labelId="theme-select-label"
          label="Theme"
          value={ctx.themeName}
          onChange={handleChange}
        >
          <MenuItem value="BlueTech">BlueTech</MenuItem>
          <MenuItem value="DarkVibrant">DarkVibrant</MenuItem>
          <MenuItem value="MinimalGray">MinimalGray</MenuItem>
          <MenuItem value="DarkSleek">DarkSleek</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
