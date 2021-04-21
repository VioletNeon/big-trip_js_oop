import {changeDateFormat, capitalizeFirstLetter} from './utils.js';

const getOfferTemplate = (pointOffers) => {
  if (pointOffers) {
    const templates = pointOffers.map(({title, price}) => {
      const offerTitle = [title].join('-');
      return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-1" type="checkbox" name="event-offer-luggage">
        <label class="event__offer-label" for="event-offer-${offerTitle}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
    });
    return templates.join(' ');
  }
  return '';
};

const getPictureTemplate = (pictures) => {
  if (pictures) {
    const templates = pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`);
    return templates.join(' ');
  }
  return '';
};

const getEditingFormTemplate = (point, destinations, offerTypes) => {
  const {type, dateFrom, dateTo, basePrice, destination, offers} = point;
  const {name, description, pictures} = destination;
  const destinationNames = destinations.map(({name}) => name);
  const allOffers = offerTypes.map(({type}) => type);
  const typeWaypoint = capitalizeFirstLetter(type);
  const eventDateAttributeValueFrom = changeDateFormat(dateFrom, 'YY/MM/DD HH:mm');
  const eventDateAttributeValueTo = changeDateFormat(dateTo, 'YY/MM/DD HH:mm');
  const typesForSelect = allOffers.map((item) => {return `
      <div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalizeFirstLetter(item)}</label>
      </div>`;}).join(' ');
  const destinationForSelect = destinationNames.map((item) => {return `<option value="${item}"></option>`;}).join(' ');
  const offersForSelect = getOfferTemplate(offers);
  const pointPictures = getPictureTemplate(pictures);

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesForSelect}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeWaypoint}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationForSelect}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventDateAttributeValueFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventDateAttributeValueTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers ${offersForSelect ? '' : 'visually-hidden'}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersForSelect}
          </div>
        </section>

        <section class="event__section  event__section--destination ${description || pointPictures.length > 0 ? '' : 'visually-hidden'}">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description ${description ? '' : 'visually-hidden'}">${description}</p>

          <div class="event__photos-container ${pointPictures ? '' : 'visually-hidden'}">
            <div class="event__photos-tape">
              ${pointPictures}
            </div>
          </div>
        </section>
      </section>
    </form>`;
};

export {getEditingFormTemplate, getPictureTemplate};
