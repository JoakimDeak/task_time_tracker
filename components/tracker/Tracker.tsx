import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Paper, Grid, styled, Theme, IconButton, useTheme, TextField, useMediaQuery } from '@mui/material';
import { EditIcon, CheckIcon, DeleteIcon, PlayIcon, PauseIcon } from '../../icons';
import { getDisplayTime, getTotalTimeFromDisplayTime, isTimeFormatCorrect } from './utils';
import { Timer } from './TrackerList';

export const TrackerButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}));

const TrackerLabel = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}));

const EditableLabel = styled(TextField)(({ theme }: { theme: Theme }) => ({
  paddingLeft: theme.spacing(2),
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

  const timeRef = useRef<HTMLInputElement>(null);

  const isTimeValid = useMemo(() => {
    if (!isEditing) {
      return true;
    }
    return timeRef?.current?.value ? isTimeFormatCorrect(timeRef.current.value) : false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRef?.current?.value]);

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

  const startTimer = useCallback(() => {
    setTimer({ ...timer, isActive: true, lastStarted: Date.now() });
  }, [timer]);

  const stopTimer = useCallback(() => {
    setTimer({ ...timer, isActive: false, seconds: timer.seconds + elapsedTime / 1000 });
  }, [elapsedTime, timer]);

  const onSubmit = useCallback(() => {
    if (nameRef?.current?.value && timeRef?.current?.value) {
      setTimer({ ...timer, name: nameRef.current.value, seconds: getTotalTimeFromDisplayTime(timeRef.current.value) });
      setIsEditing(false);
    }
  }, [timer]);

  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Paper sx={{ margin: isMobile ? 0 : 2, marginBottom: 2, backgroundColor: theme.palette.primary.main }}>
      <Grid container>
        <Grid container item xs={12} sm={8} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? (
            <EditableLabel
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  if (isNameValid) {
                    onSubmit();
                  }
                  ev.preventDefault();
                }
              }}
              variant="standard"
              defaultValue={timer.name}
              autoFocus
              inputRef={nameRef}
              error={!isNameValid}
              helperText={!isNameValid ? 'Timer name is required' : ''}
            />
          ) : (
            <TrackerLabel>{timer.name}</TrackerLabel>
          )}
          {isEditing ? (
            <EditableLabel
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  if (isTimeValid) {
                    onSubmit();
                  }
                  ev.preventDefault();
                }
              }}
              sx={{
                '& .MuiInputBase-input': {
                  padding: 0,
                  textAlign: 'right',
                  paddingRight: 2
                }
              }}
              variant="standard"
              defaultValue={getDisplayTime(timer.seconds)}
              autoFocus
              inputRef={timeRef}
              error={!isTimeValid}
              helperText={!isTimeValid ? 'Invalid format' : ''}
            />
          ) : (
            <TrackerLabel>{getDisplayTime(elapsedTime / 1000 + timer.seconds)}</TrackerLabel>
          )}
        </Grid>
        <Grid container item xs={12} sm={4} sx={{ justifyContent: 'flex-end' }}>
          <TrackerButton onClick={() => (timer.isActive ? stopTimer() : startTimer())}>{timer.isActive ? <PauseIcon /> : <PlayIcon />}</TrackerButton>
          <TrackerButton
            disabled={!(isNameValid && isTimeValid)}
            onClick={() => {
              if (isEditing) {
                onSubmit();
              } else {
                setIsEditing(true);
              }
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
