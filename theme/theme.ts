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
      primary: '#212427',
      secondary: '#ddd'
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
