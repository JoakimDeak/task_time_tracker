import { FC } from 'react';
import { Paper, IconButton, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  onCreate: () => void;
}

const TrackerCreator: FC<Props> = (props) => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  const { onCreate } = props;
  return (
    <Paper sx={{ margin: isMobile ? 0 : 2, backgroundColor: theme.palette.text.secondary, display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton sx={{ padding: 2 }} onClick={onCreate}>
        <AddIcon />
      </IconButton>
    </Paper>
  );
};

export default TrackerCreator;
