import { useState } from 'react';
import { Avatar, Menu, MenuItem, ListItemIcon, IconButton, Button, useTheme } from '@mui/material';
import { KebabMenuIcon, LogoutIcon, PrivacyIcon } from 'icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { SessionStatus } from 'types/session';

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const session = useSession();
  const theme = useTheme();

  const isLoggedIn = session.status === SessionStatus.AUTHENTICATED;

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        {isLoggedIn ? (
          <Avatar sx={{ width: 32, height: 32 }} src={session.data?.user?.image ? session.data.user.image : undefined}></Avatar>
        ) : (
          <KebabMenuIcon sx={{ color: 'text.primary' }} />
        )}
      </IconButton>
      {!isLoggedIn && (
        <Button color="info" variant="outlined" sx={{ color: theme.palette.text.primary }} onClick={() => signIn()}>
          Sign In
        </Button>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            overflow: 'visible',
            marginTop: 0.5,
            '&:before': {
              content: '""',
              position: 'absolute',
              right: isLoggedIn ? 16 : 12,
              width: 10,
              height: 10,
              backgroundColor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)'
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href="/privacypolicy" passHref>
          <MenuItem sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <PrivacyIcon fontSize="small" />
            </ListItemIcon>
            Privacy Policy
          </MenuItem>
        </Link>
        {isLoggedIn && (
          <MenuItem onClick={() => signOut()} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ProfileMenu;
