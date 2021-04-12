import dayjs from 'dayjs';

const MAX_OFFER_PRICE = 200;
const ARRAY_LENGTH_ITEM = 5;
const MAX_POINT_COST = 100;
const MIN_POINT_COST = 10;
const MAX_ID_ITEM = 999;
const SOME_POINT_COUNT = 15;

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

const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const POINT_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const POINT_NAMES = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
];

const pointOffers = [
  {
    'title': 'Upgrade to a business class',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
  {
    'title': 'Choose the radio station',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
  {
    'title': 'Upgrade to a comfort class',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
  {
    'title': 'Choose meal',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
  {
    'title': 'Choose seats',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
  {
    'title': 'Add luggage',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
  {
    'title': 'Add insurance',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
  {
    'title': 'Add sleeping set',
    'price': getRandomInteger(0, MAX_OFFER_PRICE),
  },
];

const pointPictures = [
  {
    'src': `http://picsum.photos/248/152?r=${Math.random()}`,
    'description': 'Parliament building',
  },
  {
    'src': `http://picsum.photos/248/152?r=${Math.random()}`,
    'description': 'Water utility',
  },
  {
    'src': `http://picsum.photos/248/152?r=${Math.random()}`,
    'description': 'Picturesque fields',
  },
  {
    'src': `http://picsum.photos/248/152?r=${Math.random()}`,
    'description': 'Old woods',
  },
  {
    'src': `http://picsum.photos/248/152?r=${Math.random()}`,
    'description': 'Architecture park',
  },
];

const pointIdentifiers = new Set();

const getIdentifier = () => {
  const id = getRandomInteger(0, MAX_ID_ITEM);
  if (!pointIdentifiers.has(id)) {
    pointIdentifiers.add(id);
    return id;
  }
  getIdentifier();
};

const generateDate = () => {
  const maxDayGap = 6;
  const maxHoursGap = 23;
  const maxMinutesGap = 59;
  let newPointDate = dayjs();
  return () => {
    const minutesGap = getRandomInteger(0, maxMinutesGap);
    const hoursGap = getRandomInteger(0, maxHoursGap);
    const daysGap = getRandomInteger(0, maxDayGap);
    newPointDate = newPointDate.add(minutesGap, 'minute').add(hoursGap, 'hour').add(daysGap, 'day');
    return newPointDate;
  };
};

const dateFrom = generateDate();

const generatePoint = () => {
  const type = getRandomItem(POINT_TYPES);
  const destination = {
    description: getRandomItems(POINT_DESCRIPTIONS, ARRAY_LENGTH_ITEM),
    name: getRandomItem(POINT_NAMES),
    pictures: getRandomItems(pointPictures),
  };
  const offer = {
    type,
    offers: getRandomItems(pointOffers, ARRAY_LENGTH_ITEM),
  };

  return {
    basePrice: getRandomInteger(MIN_POINT_COST, MAX_POINT_COST),
    dateFrom: dateFrom(),
    dateTo: dateFrom(),
    type,
    destination: destination.name,
    isFavorite: Boolean(getRandomInteger()),
    offers: offer.offers,
    id: getIdentifier(),
  };
};

const getPoints = () => {
  return new Array(SOME_POINT_COUNT).fill(null).map(() => {return generatePoint();});
};

export {getPoints};
