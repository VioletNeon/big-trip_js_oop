import {getRandomItems, getRandomItem, getRandomInteger, checkOfferTypes} from '../utils/common.js';
import {dayjs} from '../utils/date.js';

const MAX_OFFER_PRICE = 200;
const ARRAY_LENGTH_ITEM = 5;
const MAX_POINT_COST = 100;
const MIN_POINT_COST = 10;

const pointTypes = [
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

const pointDescriptions = [
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

const pointNames = [
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

const getIdentifier = () => {
  let id = 0;
  return () => id++;
};

const pointIdentifier = getIdentifier();

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

const dateItem = generateDate();

const offersPoint = pointTypes.map((item) => {
  return {
    type: item,
    offers: getRandomItems(pointOffers, ARRAY_LENGTH_ITEM),
  };
});

const destinations = pointNames.map((item) => {
  return {
    description: getRandomItems(pointDescriptions, ARRAY_LENGTH_ITEM).join(' '),
    name: item,
    pictures: getRandomItems(pointPictures),
  };
});

const generatePoint = () => {
  const type = getRandomItem(pointTypes);
  return {
    basePrice: getRandomInteger(MIN_POINT_COST, MAX_POINT_COST),
    dateFrom: dateItem(),
    dateTo: dateItem(),
    type: type,
    destination: getRandomItem(destinations),
    isFavorite: Boolean(getRandomInteger()),
    offers: getRandomItems(checkOfferTypes(type, offersPoint)),
    id: pointIdentifier(),
  };
};

export {generatePoint, offersPoint, destinations};
