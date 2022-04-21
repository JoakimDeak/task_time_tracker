export const getDisplayTime = (secondsTotal: number) => {
  let days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0;
  if (secondsTotal > 28800) {
    days = Math.floor(secondsTotal / 28800);
    secondsTotal -= days * 28800;
  }
  if (secondsTotal > 3600) {
    hours = Math.floor(secondsTotal / 3600);
    secondsTotal -= hours * 3600;
  }
  if (secondsTotal > 60) {
    minutes = Math.floor(secondsTotal / 60);
    secondsTotal -= minutes * 60;
  }
  if (secondsTotal > 0) {
    seconds = secondsTotal % 60;
  }
  return `${days ? `${days}d` : ''} ${hours ? `${hours}h` : ''} ${minutes ? `${minutes}m` : ''} ${seconds ? `${seconds | 0}s` : ''}`;
};
