import { FC, useEffect, useState } from 'react';
import { Container, LinearProgress, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import Timer from './Timer';
import { v4 as uuid } from 'uuid';
import TimerCreator from './TimerCreator';
import { useStateWithCallback } from 'hooks/useStateWithCallback';
import { useSession } from 'next-auth/react';
import { SessionStatus } from 'types/session';
import TimerListHeader from './TimerListHeader';

export interface Timer {
  name: string;
  seconds: number;
  _id: string;
  isActive: boolean;
  lastStarted: number;
  isEditing: boolean;
}

const TimerList: FC = () => {
  const [timers, setTimers] = useStateWithCallback<Timer[]>([]);
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const saveTimers = (timers: Timer[]) => {
    if (status === SessionStatus.AUTHENTICATED) {
      fetch('api/timers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(timers) });
    } else if (status === SessionStatus.UNAUTHENTICATED) {
      localStorage.setItem('timers', JSON.stringify(timers));
    }
  };

  const changeTimer = (timer: Timer) => {
    const index = timers.findIndex((el) => el._id === timer._id);
    if (index !== -1) {
      setTimers([...timers.slice(0, index), timer, ...timers.slice(index + 1)], (timers) => saveTimers(timers));
    }
  };

  useEffect(
    function loadTimers() {
      setIsLoading(true);
      if (status === SessionStatus.AUTHENTICATED) {
        fetch('api/timers')
          .then((res) => res.json())
          .then((data) => {
            setTimers(data);
            setIsLoading(false);
          })
          .catch((error) => console.log(error));
      } else if (status === SessionStatus.UNAUTHENTICATED) {
        const timers = localStorage.getItem('timers');
        if (timers) {
          setTimers(JSON.parse(timers));
          setIsLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status]
  );

  const addTimer = () => {
    const newTimer = {
      name: '',
      seconds: 0,
      _id: uuid(),
      isActive: false,
      lastStarted: Date.now(),
      isEditing: true
    };
    setTimers([...timers, newTimer], (timers) => saveTimers(timers));
  };

  const deleteTimer = (id: string) => {
    setTimers(
      timers.filter((timer) => timer._id !== id),
      (timers) => saveTimers(timers)
    );
  };

  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Container sx={{ marginTop: isMobile ? 0 : 5, maxWidth: 'md' }} disableGutters={isMobile}>
      <Paper sx={{ padding: 2 }}>
        <TimerListHeader timers={timers} />
        {isLoading && <LinearProgress sx={{ margin: theme.spacing(1, 2) }} />}
        {timers.map((timer) => (
          <Timer key={timer._id} defaultTimer={timer} onChange={changeTimer} onDelete={deleteTimer} />
        ))}
        <TimerCreator onCreate={addTimer} />
      </Paper>
    </Container>
  );
};

export default TimerList;
