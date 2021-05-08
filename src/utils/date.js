import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

const getDuration = (dateFrom, dateTo) => {
  let minutes = dayjs(dateTo).diff(dateFrom, 'm');
  let hours = dayjs(dateTo).diff(dateFrom, 'h');
  const days = dayjs(dateTo).diff(dateFrom, 'd');
  if (days) {
    hours = hours % 24;
    minutes = minutes % 60;
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours) {
    minutes = minutes % 60;
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

const changeDateFormat = (date, dateFormat) => {
  return dayjs(date).format(dateFormat);
};

export {changeDateFormat, getDuration, dayjs, flatpickr};
