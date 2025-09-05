'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#193cb8' },
    secondary: { main: '#155dfc' },
  },
  shape: { borderRadius: 10 },
});

export default theme; 