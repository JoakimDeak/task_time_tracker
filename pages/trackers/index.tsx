import { FC, useState } from 'react';
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

  const onDeleteTimer = (id: string) => {
    setTimers(timers.filter((timer) => timer.id !== id));
  };

  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  console.log(isMobile);

  return (
    <Container sx={{ marginTop: isMobile ? 0 : 10, maxWidth: 'md' }} disableGutters={isMobile}>
      <Paper sx={{ padding: 2 }}>
        {timers.map((timer) => (
          <Tracker key={timer.id} defaultTimer={timer} onDelete={onDeleteTimer} defaultIsEditing={!timer.name} />
        ))}
        <TrackerCreator onCreate={addTimer} />
      </Paper>
    </Container>
  );
};

export default Trackers;
