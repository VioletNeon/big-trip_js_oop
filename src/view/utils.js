import dayjs from 'dayjs';

const getRandomInteger = (from = 0, to = 1, pointer = 0) => {
  [from, to, pointer] = [Math.abs(from), Math.abs(to), Math.abs(pointer)];
  if (from >= to) {
    [from, to] = [to, from];
  }
  return +(Math.random() * Math.abs(to - from) + from).toFixed(pointer);
};

const getRandomItems = (array, arrayLength = array.length) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(0, getRandomInteger(0, arrayLength));
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

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const renderElement = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const renderTemplate = (container, template, place = RenderPosition.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export {changeDateFormat, getDuration, capitalizeFirstLetter, getRandomItem, getRandomItems, getRandomInteger, checkOfferTypes, dayjs, RenderPosition, renderElement, renderTemplate, createElement};
