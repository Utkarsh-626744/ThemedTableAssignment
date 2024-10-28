'use client';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import CryptoTableContainer from '@/components/CryptoTableContainer';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const [darkMode, setDarkMode] = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CryptoTableContainer
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />
    </ThemeProvider>
  );
}