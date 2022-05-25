import { FC, useState } from 'react';
import { Button, Grid, Typography, useTheme } from '@mui/material';
import { useSession, signIn } from 'next-auth/react';
import { SessionStatus } from '../../types/session';
import ProfileMenu from './ProfileMenu';

interface Props {}

const Header: FC<Props> = (props) => {
  const session = useSession();
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
        <Grid container item xs="auto">
          <Typography sx={{ fontWeight: 600, color: '#eee' }}>Task Time Tracker</Typography>
        </Grid>
        <Grid item xs="auto">
          {session.status === SessionStatus.AUTHENTICATED ? (
            <ProfileMenu />
          ) : (
            <Button color="info" variant="outlined" sx={{ color: theme.palette.text.primary }} onClick={() => signIn()}>
              Sign In
            </Button>
          )}
        </Grid>
      </Grid>
      <div style={{ height: height }} />
    </>
  );
};

export default Header;
