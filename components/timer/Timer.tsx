import { FC, useCallback, useMemo, useState } from 'react';
import { Paper, Grid, styled, Theme, IconButton, useTheme, TextField, useMediaQuery } from '@mui/material';
import { EditIcon, CheckIcon, DeleteIcon, PlayIcon, PauseIcon } from 'icons';
import { getDisplayTime, getTotalTimeFromDisplayTime, isTimeFormatCorrect } from './utils';
import { Timer } from './TimerList';
import TimerDurationLabel from './TimerDurationLabel';
import { useStateWithCallback } from 'hooks/useStateWithCallback';

export const TimerButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}));

const TimerLabel = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2)
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
}

const Timer: FC<Props> = (props) => {
  const { defaultTimer, onChange, onDelete } = props;
  const theme = useTheme();
  const [timer, setTimer] = useStateWithCallback(defaultTimer);

  const getElapsedTime = useCallback(() => (timer.isActive ? (Date.now() - timer.lastStarted) / 1000 : 0), [timer.isActive, timer.lastStarted]);

  const [nameInputString, setNameInputString] = useState(timer.name);
  const isNameValid = useMemo(() => {
    return timer.isEditing ? nameInputString : timer.name;
  }, [timer.isEditing, timer.name, nameInputString]);

  const [timeInputString, setTimeInputString] = useState(getDisplayTime(timer.seconds + getElapsedTime()));
  const isTimeValid = useMemo(() => {
    if (!timer.isEditing) {
      return true;
    }
    return timeInputString ? isTimeFormatCorrect(timeInputString) : false;
  }, [timeInputString, timer.isEditing]);

  const startTimer = useCallback(() => {
    setTimer({ ...timer, isActive: true, lastStarted: Date.now() }, (timer) => onChange(timer));
  }, [onChange, setTimer, timer]);

  const stopTimer = useCallback(
    () => setTimer({ ...timer, isActive: false, seconds: timer.seconds + getElapsedTime() }, (timer) => onChange(timer)),
    [getElapsedTime, onChange, setTimer, timer]
  );

  const onSubmit = useCallback(() => {
    if (nameInputString && timeInputString) {
      setTimer({ ...timer, name: nameInputString, seconds: getTotalTimeFromDisplayTime(timeInputString), isEditing: false, lastStarted: Date.now() }, (timer) =>
        onChange(timer)
      );
    }
  }, [nameInputString, onChange, setTimer, timeInputString, timer]);

  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Paper sx={{ margin: isMobile ? 0 : 2, marginBottom: 2, backgroundColor: theme.palette.primary.main }}>
      <Grid container>
        <Grid container item xs={12} sm={8} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {timer.isEditing ? (
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
              onChange={(e) => setNameInputString(e.target.value)}
              error={!isNameValid}
              helperText={!isNameValid ? 'Timer name is required' : ''}
            />
          ) : (
            <TimerLabel>{timer.name}</TimerLabel>
          )}
          {timer.isEditing ? (
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
              error={!isTimeValid}
              onChange={(e) => setTimeInputString(e.target.value)}
              helperText={!isTimeValid ? 'Invalid format' : ''}
            />
          ) : (
            <TimerDurationLabel timer={timer} />
          )}
        </Grid>
        <Grid container item xs={12} sm={4} sx={{ justifyContent: 'flex-end' }}>
          <TimerButton onClick={() => (timer.isActive ? stopTimer() : startTimer())}>{timer.isActive ? <PauseIcon /> : <PlayIcon />}</TimerButton>
          <TimerButton
            disabled={!(isNameValid && isTimeValid)}
            onClick={() => {
              if (timer.isEditing) {
                onSubmit();
              } else {
                setTimer({ ...timer, isEditing: true, seconds: getTotalTimeFromDisplayTime(timeInputString) + getElapsedTime() }, (timer) => {
                  setTimeInputString(getDisplayTime(timer.seconds));
                  onChange(timer);
                });
              }
            }}
          >
            {timer.isEditing ? <CheckIcon /> : <EditIcon />}
          </TimerButton>
          <TimerButton onClick={() => onDelete(timer._id)}>
            <DeleteIcon />
          </TimerButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Timer;
