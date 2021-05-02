import {changeDateFormat, dayjs, createElement} from './utils.js';

export default class TripInfo {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    const POINTS_TRIP_SIZE = 3;
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
      totalPrice = totalPrice + basePrice + offersPrice;
    });

    const minDateFrom = dayjs(Math.min(...destinationPoints));
    const maxDateTo = dayjs(Math.max(...destinationPoints));
    const destinations = Array.from(allDestinationNames);
    const tripList = destinations.length > POINTS_TRIP_SIZE ? `${destinations[0]} - ... - ${destinations[destinations.length - 1]}` : destinations.join(' - ');
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

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
