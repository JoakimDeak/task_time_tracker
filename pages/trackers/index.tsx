import { FC, useState } from 'react';
import { Container, Paper, useTheme } from '@mui/material';
import Tracker from './Tracker';
import { v4 as uuid } from 'uuid';

export interface Timer {
  name: string;
  seconds: number;
  id: string;
  isActive: boolean;
  lastStarted: number;
}

// temp for testing
const generateTimers = (num: number): Timer[] => {
  const timers: Timer[] = [];
  for (let i = 0; i < num; i++) {
    timers.push({
      name: `POF-${(Math.random() * 2000) | 0}`,
      seconds: Math.random() * 40000,
      id: uuid(),
      isActive: true,
      lastStarted: Date.now()
    });
  }
  return timers;
};

const Trackers: FC = () => {
  const [timers, setTimers] = useState(generateTimers(10));

  const onDeleteTimer = (id: string) => {
    setTimers(timers.filter((timer) => timer.id !== id));
  };

  return (
    <Container sx={{ marginTop: 10, maxWidth: 'md' }}>
      <Paper sx={{ padding: 2 }}>
        {timers.map((timer) => (
          <Tracker key={timer.id} timer={timer} onDelete={onDeleteTimer} />
        ))}
      </Paper>
    </Container>
  );
};

export default Trackers;
