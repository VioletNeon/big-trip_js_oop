import dayjs from 'dayjs';

const sortWaypointTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(pointA.dateFrom);
  const durationB = dayjs(pointB.dateTo).diff(pointB.dateFrom);
  return durationB - durationA;
};

const sortWaypointPrice = (pointA, pointB) => {
  const priceA = pointA.basePrice;
  const priceB = pointB.basePrice;
  return priceB - priceA;
};

const sortWaypointDay = (pointA, pointB) => {
  const dayA = pointA.dateFrom;
  const dayB = pointB.dateFrom;
  return dayjs(dayA).diff(dayjs(dayB));
};

export {sortWaypointTime, sortWaypointPrice, sortWaypointDay};
