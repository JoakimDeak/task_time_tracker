import { FC } from 'react';
import { Paper, IconButton, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { TrackerButton } from './Tracker';

interface Props {
  onCreate: () => void;
}

const TrackerCreator: FC<Props> = (props) => {
  const { onCreate } = props;
  const theme = useTheme();
  return (
    <Paper sx={{ margin: 2, backgroundColor: theme.palette.text.primary, display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton sx={{ padding: 2 }} onClick={onCreate}>
        <AddIcon />
      </IconButton>
    </Paper>
  );
};

export default TrackerCreator;
