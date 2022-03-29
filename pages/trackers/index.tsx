import { FC } from 'react';
import { useTheme, Container } from '@mui/material';
import Tracker from './Tracker';

const Trackers: FC = () => {
  return (
    <Container>
      <Tracker></Tracker>
      <Tracker></Tracker>
      <Tracker></Tracker>
    </Container>
  );
};

export default Trackers;
