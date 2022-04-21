import { createTheme } from '@mui/material';

/**
 
  color palette idea
  background of #2c0e37 or a dark gray would probably be better like #131b26, #212121
  ui elements of #690375
  text of #fcfaf9


  the same color can be reused if you change the saturation. for example having an outline on the edit button on trackers


  maybe add the bi flag as a wavey background thingy. whould be sick and subtle


 */

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
    }
  }
});

export default theme;
