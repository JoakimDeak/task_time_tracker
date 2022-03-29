import { FC } from 'react';
import { Grid } from '@mui/material';

interface Props {}

const Tracker: FC<Props> = () => {
  return (
    <Grid container sx={{ backgroundColor: 'green' }}>
      <Grid container item xs={8}>
        <Grid item>task name</Grid>
        <Grid item>task time</Grid>
      </Grid>
      <Grid container item xs={4}>
        <Grid item>icon1</Grid>
        <Grid item>icon2</Grid>
        <Grid item>icon3</Grid>
      </Grid>
    </Grid>
  );
};

export default Tracker;
