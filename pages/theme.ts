import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0747A6'
    },
    text: {
      primary: '#ddd'
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
