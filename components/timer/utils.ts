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

  let displayTime = '';
  if (days) {
    displayTime += `${days}d `;
  }
  if (hours) {
    displayTime += `${hours}h `;
  }
  if (minutes) {
    displayTime += `${minutes}m `;
  }
  displayTime += `${seconds | 0}s`;

  return displayTime;
};

export const getTotalTimeFromDisplayTime = (displayTime: string) => {
  const timeParts = displayTime.replaceAll(/[dhms]+/g, '$& ').split(' ');
  let secondsTotal = 0;
  for (let i = 0; i < timeParts.length; i++) {
    const timePart = timeParts[i];
    const timePartNumber = parseInt(timePart.substring(0, timePart.length - 1), 10);
    switch (timePart.substring(timePart.length - 1)) {
      case 'd':
        secondsTotal += timePartNumber * 28800;
        break;
      case 'h':
        secondsTotal += timePartNumber * 3600;
        break;
      case 'm':
        secondsTotal += timePartNumber * 60;
        break;
      case 's':
        secondsTotal += timePartNumber;
        break;
    }
  }
  return secondsTotal;
};

export const isTimeFormatCorrect = (timeString: string) => {
  const regex = /(?:(\d+d))?(?:(\d+h))?(?:(\d+m))?(?:(\d+s))?/;
  const matchString = timeString.replaceAll(' ', '');
  if (!matchString) {
    return false;
  }
  const matches = regex.exec(matchString);
  if (!matches) {
    return false;
  }
  if (matches[0] === matchString) {
    return true;
  } else {
    return false;
  }
};
