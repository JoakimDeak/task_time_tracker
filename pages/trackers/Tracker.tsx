import { FC, useEffect, useMemo, useReducer, useState } from 'react';
import { Paper, Grid, styled, Theme, IconButton, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { getDisplayTime } from './utils';
import { Timer } from '.';

const TrackerButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}));

const TrackerLabel = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}));

interface Props {
  timer: Timer;
  onDelete: (id: string) => void;
}

const Tracker: FC<Props> = (props) => {
  const theme = useTheme();
  const [timer, setTimer] = useState(props.timer);

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const elapsedTime = useMemo(() => {
    return timer.isActive ? Date.now() - timer.lastStarted : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isActive, timer.lastStarted, time]);

  const { onDelete } = props;
  return (
    <Paper sx={{ margin: 2, backgroundColor: theme.palette.primary.main }}>
      <Grid container>
        <Grid container item xs={8} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <TrackerLabel>{timer.name}</TrackerLabel>
          <TrackerLabel>{getDisplayTime(elapsedTime / 1000 + timer.seconds)}</TrackerLabel>
        </Grid>
        <Grid container item xs={4} sx={{ justifyContent: 'flex-end' }}>
          <TrackerButton
            onClick={() => {
              if (timer.isActive) {
                setTimer({ ...timer, isActive: false, seconds: timer.seconds + elapsedTime / 1000 });
              } else {
                setTimer({ ...timer, isActive: true, lastStarted: Date.now() });
              }
            }}
          >
            {timer.isActive ? <PauseIcon /> : <PlayArrowIcon />}
          </TrackerButton>
          <TrackerButton>
            <EditIcon />
          </TrackerButton>
          <TrackerButton onClick={() => onDelete(timer.id)}>
            <DeleteIcon />
          </TrackerButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Tracker;
