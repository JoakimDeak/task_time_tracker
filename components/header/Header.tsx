import { FC, useState } from 'react';
import { Grid, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import HeaderMenu from './HeaderMenu';

const Header: FC = () => {
  const theme = useTheme();
  const [height, setHeight] = useState(0);

  return (
    <>
      <Grid
        ref={(el: HTMLDivElement | null) => {
          if (!el) {
            return;
          }
          const newHeight = el.getBoundingClientRect().height;
          setHeight(newHeight);
        }}
        container
        sx={{
          backgroundColor: theme.palette.primary.dark,
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing(1, 2),
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1000
        }}
      >
        <Link href="/" passHref>
          <Grid container item xs="auto" sx={{ cursor: 'pointer' }}>
            <Typography sx={{ fontWeight: 600, color: '#eee' }}>Task Time Tracker</Typography>
          </Grid>
        </Link>
        <Grid item xs="auto">
          <HeaderMenu />
        </Grid>
      </Grid>
      <div style={{ height: height }} />
    </>
  );
};

export default Header;
