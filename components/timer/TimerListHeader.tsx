import { Grid, Typography, useTheme } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { Timer } from './TimerList';
import { getDisplayTime } from './utils';

interface Props {
  timers: Timer[];
}

const TimerListHeader: FC<Props> = (Props) => {
  const { timers } = Props;
  const theme = useTheme();

  const [clock, setClock] = useState(0);
  useEffect(function clock() {
    const interval = setInterval(() => setClock(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalTrackedTime = useMemo(
    () =>
      Math.floor(
        timers.reduce((totalTime, timer) => totalTime + timer.seconds + (timer.isActive && !timer.isEditing ? (Date.now() - timer.lastStarted) / 1000 : 0), 0)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timers, clock]
  );

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={6}>
        <Typography variant="h6" color="text.secondary" sx={{ padding: theme.spacing(0.5, 1) }}>
          Tasks
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" color="text.secondary" sx={{ padding: theme.spacing(0.5, 1), textAlign: 'right' }}>
          {`Total time: ${getDisplayTime(totalTrackedTime)}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TimerListHeader;
