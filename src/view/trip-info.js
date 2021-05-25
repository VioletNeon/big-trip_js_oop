import AbstractView from './abstract.js';
import {changeDateFormat, dayjs} from '../utils/date.js';

const POINTS_TRIP_SIZE = 3;

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    const destinationPoints = [];
    const allDestinationNames = new Set();
    const startDateMark = dayjs(0);
    let totalPrice = 0;

    this._points.forEach(({dateFrom, dateTo, basePrice, destination, offers}) => {
      const {name} = destination;
      let offersPrice = 0;
      const dateFromDiff = dayjs(dateFrom).diff(startDateMark, 'ms');
      const dateToDiff = dayjs(dateTo).diff(startDateMark, 'ms');
      destinationPoints.push(dateFromDiff, dateToDiff);
      allDestinationNames.add(name);

      if (offers.length > 0) {
        offersPrice = offers.map(({price}) => price).reduce((sum, current) => sum + current);
      }
      totalPrice = totalPrice + Number(basePrice) + offersPrice;
    });

    const minDateFrom = dayjs(Math.min(...destinationPoints));
    const maxDateTo = dayjs(Math.max(...destinationPoints));
    const destinations = Array.from(allDestinationNames);
    const firstWaypoint = destinations[0];
    const lastWaypoint = destinations[destinations.length - 1];
    const longTrip = `${firstWaypoint} - ... - ${lastWaypoint}`;
    const shortTrip = destinations.join(' - ');
    const tripList = destinations.length > POINTS_TRIP_SIZE ? longTrip : shortTrip;
    const dateTripFrom = changeDateFormat(minDateFrom, 'MMM DD');
    const dateTripTo = changeDateFormat(maxDateTo, 'MMM DD');
    return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripList}</h1>
        <p class="trip-info__dates">${dateTripFrom}&nbsp;&mdash;&nbsp;${dateTripTo}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
  }
}
