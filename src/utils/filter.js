import {FilterType} from './const.js';
import {isPointExpired, isPointExpiringSoon} from './date.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointExpiringSoon(point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.dateFrom)),
};

export {filter};
