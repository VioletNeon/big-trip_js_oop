import {changeDateFormat, getDuration, capitalizeFirstLetter} from './utils.js';

const getWaypointTemplate = (point) => {
  const {type, dateFrom, dateTo, basePrice, destination, isFavorite, offers} = point;
  const destinationPoint = destination.name;
  const eventDateAttributeFormat = changeDateFormat(dateFrom, 'YYYY-MM-DD');
  const eventDateTimeFormat = changeDateFormat(dateFrom, 'MMM DD');
  const typeWaypoint = capitalizeFirstLetter(type);
  const eventStartDateAttributeFormat = changeDateFormat(dateFrom, 'YYYY-MM-DDTHH:mm');
  const eventStartDateTimeFormat = changeDateFormat(dateFrom, 'HH:mm');
  const eventEndDateAttributeFormat = changeDateFormat(dateTo, 'YYYY-MM-DDTHH:mm');
  const eventEndDateTimeFormat = changeDateFormat(dateTo, 'HH:mm');
  const eventDuration = getDuration(dateFrom, dateTo);
  const offersForSelect = offers.map(({title, price}) => {
    return `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`;
  }).join(' ');

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${eventDateAttributeFormat}">${eventDateTimeFormat}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeWaypoint} ${destinationPoint}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${eventStartDateAttributeFormat}">${eventStartDateTimeFormat}</time>
            &mdash;
            <time class="event__end-time" datetime="${eventEndDateAttributeFormat}">${eventEndDateTimeFormat}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersForSelect}
        </ul>
        <button class="event__favorite-btn event__favorite-btn${isFavorite ? '--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export {getWaypointTemplate};
