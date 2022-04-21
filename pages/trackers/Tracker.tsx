import { FC, useEffect, useMemo, useState } from 'react';
import { Paper, Grid, styled, Theme, IconButton, useTheme, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { getDisplayTime } from './utils';
import { Timer } from '.';

export const TrackerButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}));

const TrackerLabel = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}));

interface Props {
  defaultTimer: Timer;
  onDelete: (id: string) => void;
  defaultIsEditing: boolean;
}

const Tracker: FC<Props> = (props) => {
  const { defaultTimer, defaultIsEditing } = props;
  const theme = useTheme();
  const [timer, setTimer] = useState(defaultTimer);
  const [time, setTime] = useState(Date.now());
  const [isEditing, setIsEditing] = useState(defaultIsEditing);

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

  const startTimer = () => {
    setTimer({ ...timer, isActive: true, lastStarted: Date.now() });
  };

  const stopTimer = () => {
    setTimer({ ...timer, isActive: false, seconds: timer.seconds + elapsedTime / 1000 });
  };

  const isValid = (name: string) => {
    return !!name;
  };

  const { onDelete } = props;
  return (
    <Paper sx={{ margin: 2, backgroundColor: theme.palette.primary.main }}>
      <Grid container>
        <Grid container item xs={8} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? (
            <TextField
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  if (isValid(timer.name)) {
                    setIsEditing(!isEditing);
                  }
                  ev.preventDefault();
                }
              }}
              variant="standard"
              sx={{
                paddingLeft: 2,
                '& .MuiInput-underline:before': {
                  borderBottomColor: theme.palette.text.primary
                },
                '& .MuiInput-underline:after': {
                  borderBottom: '1px solid',
                  borderBottomColor: theme.palette.text.primary
                },
                '& .MuiInputBase-input': {
                  padding: 0
                }
              }}
              defaultValue={timer.name}
              autoFocus
              error={!isValid(timer.name)}
              helperText={!isValid(timer.name) ? 'Timer name is required' : ''}
              onChange={(event) => setTimer({ ...timer, name: event.target.value })}
            />
          ) : (
            <TrackerLabel>{timer.name}</TrackerLabel>
          )}
          <TrackerLabel>{getDisplayTime(elapsedTime / 1000 + timer.seconds)}</TrackerLabel>
        </Grid>
        <Grid container item xs={4} sx={{ justifyContent: 'flex-end' }}>
          <TrackerButton onClick={() => (timer.isActive ? stopTimer() : startTimer())}>{timer.isActive ? <PauseIcon /> : <PlayArrowIcon />}</TrackerButton>
          <TrackerButton onClick={() => isValid(timer.name) && setIsEditing(!isEditing)}>{isEditing ? <CheckIcon /> : <EditIcon />}</TrackerButton>
          <TrackerButton onClick={() => onDelete(timer.id)}>
            <DeleteIcon />
          </TrackerButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Tracker;
