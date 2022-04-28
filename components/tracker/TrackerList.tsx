import { FC, useEffect } from 'react';
import { Container, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import Tracker from './Tracker';
import { v4 as uuid } from 'uuid';
import TrackerCreator from './TrackerCreator';
import { useStateWithCallback } from '../../hooks/useStateWithCallback';

export interface Timer {
  name: string;
  seconds: number;
  id: string;
  isActive: boolean;
  lastStarted: number;
}

const Trackers: FC = () => {
  const [timers, setTimers] = useStateWithCallback<Timer[]>([]);

  const saveTimers = (timers: Timer[]) => {
    localStorage.setItem('timers', JSON.stringify(timers));
  };

  const changeTimer = (timer: Timer) => {
    const index = timers.findIndex((el) => el.id === timer.id);
    if (index !== -1) {
      setTimers([...timers.slice(0, index), timer, ...timers.slice(index + 1)], (timers) => saveTimers(timers));
    }
  };

  useEffect(() => {
    const timers = localStorage.getItem('timers');
    if (timers) {
      setTimers(JSON.parse(timers));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTimer = () => {
    const newTimer = {
      name: '',
      seconds: 0,
      id: uuid(),
      isActive: false,
      lastStarted: Date.now()
    };
    setTimers([...timers, newTimer], (timers) => saveTimers(timers));
  };

  const deleteTimer = (id: string) => {
    setTimers(
      timers.filter((timer) => timer.id !== id),
      (timers) => saveTimers(timers)
    );
  };

  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Container sx={{ marginTop: isMobile ? 0 : 5, maxWidth: 'md' }} disableGutters={isMobile}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ padding: theme.spacing(0.5, 1) }}>
          Tasks
        </Typography>
        {timers.map((timer) => (
          <Tracker key={timer.id} defaultTimer={timer} onChange={changeTimer} onDelete={deleteTimer} defaultIsEditing={!timer.name} />
        ))}
        <TrackerCreator onCreate={addTimer} />
      </Paper>
    </Container>
  );
};

export default Trackers;
