import type { AppProps } from 'next/app';
// import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />;
      </ThemeProvider>
    </CssBaseline>
  );
}

export default MyApp;
