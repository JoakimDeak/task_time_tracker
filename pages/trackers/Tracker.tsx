import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Paper, Grid, styled, Theme, IconButton, useTheme, TextField, useMediaQuery } from '@mui/material';
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
  onChange: (timer: Timer) => void;
  onDelete: (id: string) => void;
  defaultIsEditing: boolean;
}

const Tracker: FC<Props> = (props) => {
  const { defaultTimer, defaultIsEditing, onChange, onDelete } = props;
  const theme = useTheme();
  const [timer, setTimer] = useState(defaultTimer);
  const [time, setTime] = useState(Date.now());
  const [isEditing, setIsEditing] = useState(defaultIsEditing);

  const nameRef = useRef<HTMLInputElement>(null);
  const isNameValid = useMemo(() => {
    return isEditing ? nameRef?.current?.value : !!timer.name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameRef?.current?.value]);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    onChange(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

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

  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Paper sx={{ margin: isMobile ? 0 : 2, marginBottom: 2, backgroundColor: theme.palette.primary.main }}>
      <Grid container>
        <Grid container item xs={12} sm={8} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? (
            <TextField
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  if (isNameValid && nameRef?.current?.value) {
                    setTimer({ ...timer, name: nameRef.current.value });
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
              inputRef={nameRef}
              error={!isNameValid}
              helperText={!isNameValid ? 'Timer name is required' : ''}
            />
          ) : (
            <TrackerLabel>{timer.name}</TrackerLabel>
          )}
          <TrackerLabel>{getDisplayTime(elapsedTime / 1000 + timer.seconds)}</TrackerLabel>
        </Grid>
        <Grid container item xs={12} sm={4} sx={{ justifyContent: 'flex-end' }}>
          <TrackerButton onClick={() => (timer.isActive ? stopTimer() : startTimer())}>{timer.isActive ? <PauseIcon /> : <PlayArrowIcon />}</TrackerButton>
          <TrackerButton
            disabled={!isNameValid}
            onClick={() => {
              if (isEditing && isNameValid && nameRef?.current?.value) {
                setTimer({ ...timer, name: nameRef.current.value });
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? <CheckIcon /> : <EditIcon />}
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
