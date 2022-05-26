import { FC, useEffect, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import { Timer } from './TimerList';
import { getDisplayTime } from './utils';

interface Props {
  timer: Timer;
}

const TimerDurationLabel: FC<Props> = (props) => {
  const { timer } = props;

  const [clock, setClock] = useState(0);
  useEffect(function clock() {
    const interval = setInterval(() => setClock(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const trackedTime = useMemo(
    () => timer.seconds + (timer.isActive ? (Date.now() - timer.lastStarted) / 1000 : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timer, clock]
  );

  return <Typography sx={{ padding: 2 }}>{getDisplayTime(trackedTime)}</Typography>;
};

export default TimerDurationLabel;
