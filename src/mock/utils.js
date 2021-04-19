import dayjs from 'dayjs';

const getRandomInteger = (from = 0, to = 1, pointer = 0) => {
  [from, to, pointer] = [Math.abs(from), Math.abs(to), Math.abs(pointer)];
  if (from >= to) {
    [from, to] = [to, from];
  }
  return +(Math.random() * Math.abs(to - from) + from).toFixed(pointer);
};

const getRandomItems = (array, arrayLength = array.length) => {
  return array.sort(() => { return Math.random() - 0.5; }).slice(0, getRandomInteger(0, arrayLength));
};

const getRandomItem = (someArray) => {
  const randomIndex = getRandomInteger(0, someArray.length - 1);

  return someArray[randomIndex];
};

const changeDateFormat = (date, dateFormat) => {
  return dayjs(date).format(dateFormat);
};

const checkOfferTypes = (pointType, offer) => {
  for (const {type, offers} of offer) {
    if (type === pointType) {
      return offers;
    }
  }
};

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

const capitalizeFirstLetter = (string) => {
  if (!string) return string;

  return string[0].toUpperCase() + string.slice(1);
};

export {changeDateFormat, getDuration, capitalizeFirstLetter, getRandomItem, getRandomItems, getRandomInteger, checkOfferTypes, dayjs};
