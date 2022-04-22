import { FC, useEffect, useState } from 'react';
import { Container, Paper, useMediaQuery, useTheme } from '@mui/material';
import Tracker from './Tracker';
import { v4 as uuid } from 'uuid';
import TrackerCreator from './TrackerCreator';

export interface Timer {
  name: string;
  seconds: number;
  id: string;
  isActive: boolean;
  lastStarted: number;
}

const Trackers: FC = () => {
  const [timers, setTimers] = useState<Timer[]>([]);

  const loadTimers = () => {
    const timers = localStorage.getItem('timers');
    if (timers) {
      setTimers(JSON.parse(timers));
    }
  };

  useEffect(() => {
    console.log('saving timers');
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  const changeTimer = (timer: Timer) => {
    const index = timers.findIndex((el) => el.id === timer.id);
    if (index !== -1) {
      // setTimers([...timers.slice(0, index), timer, ...timers.slice(index + 1)]);
      // timers[index] = timer;
    }
  };

  useEffect(() => {
    loadTimers();
  }, []);

  const addTimer = () => {
    const newTimer = {
      name: '',
      seconds: 0,
      id: uuid(),
      isActive: false,
      lastStarted: Date.now()
    };
    setTimers([...timers, newTimer]);
  };

  const deleteTimer = (id: string) => {
    setTimers(timers.filter((timer) => timer.id !== id));
  };

  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Container sx={{ marginTop: isMobile ? 0 : 10, maxWidth: 'md' }} disableGutters={isMobile}>
      <Paper sx={{ padding: 2 }}>
        {timers.map((timer) => (
          <Tracker key={timer.id} defaultTimer={timer} onChange={changeTimer} onDelete={deleteTimer} defaultIsEditing={!timer.name} />
        ))}
        <TrackerCreator onCreate={addTimer} />
      </Paper>
    </Container>
  );
};

export default Trackers;
