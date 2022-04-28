import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0747A6'
    },
    info: {
      main: '#fff'
    },
    text: {
      primary: '#ddd',
      secondary: '#212427'
    },
    background: {
      default: 'fff',
      paper: '#fcfaf9'
    },
    error: {
      main: '#ddd'
    }
  }
});

export default theme;
