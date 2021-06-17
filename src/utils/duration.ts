export default (duration: number): string => { //duration is in miliseconds
  let totalSeconds = Math.round(duration / 1000);
  const weeks = Math.floor(duration / (24 * 60 * 60 * 1000 * 7)),
    days = Math.floor(duration / (24 * 60 * 60 * 1000)) % 7,
    hours = Math.floor(totalSeconds / 3600) % 24;
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60),
    seconds = Math.round(totalSeconds % 60);
  //@ts-ignore types
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  //@ts-ignore types
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  return `${weeks ? `${weeks}w ` : ""}${days ? `${days}d ` : ""}${
    hours ? `${hours}h ` : ""
  }${minutes ? `${minutes}m ` : ""}${seconds}s`;
};
