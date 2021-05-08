import AbstractView from './abstract.js';
import {capitalizeFirstLetter} from '../utils/common.js';
import {changeDateFormat, flatpickr} from '../utils/date.js';
import {getPictureTemplate} from './get-picture-template.js';

export default class EditingForm extends AbstractView {
  constructor(point, destinations, offers) {
    super();
    this._point = point;
    this._destinations = destinations;
    this._offers = offers;
    this._editingFormSubmitHandler = this._editingFormSubmitHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._inputEventDestinationChangeHandler = this._inputEventDestinationChangeHandler.bind(this);
  }

  getOfferTemplate(pointOffers) {
    if (pointOffers) {
      const templates = pointOffers.map(({title, price}) => {
        const offerTitle = [title].join('-');
        return `<div class="event__offer-selector">
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
  }

  getTemplate() {
    const {type, dateFrom, dateTo, basePrice, destination, offers} = this._point;
    const {name, description, pictures} = destination;
    const destinationNames = this._destinations.map(({name}) => name);
    const allOffers = this._offers.map(({type}) => type);
    const typeWaypoint = capitalizeFirstLetter(type);
    const eventDateAttributeValueFrom = changeDateFormat(dateFrom, 'YY/MM/DD HH:mm');
    const eventDateAttributeValueTo = changeDateFormat(dateTo, 'YY/MM/DD HH:mm');
    const typesForSelect = allOffers.map((item) => {return `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalizeFirstLetter(item)}</label>
      </div>`;}).join(' ');
    const destinationForSelect = destinationNames.map((item) => {return `<option value="${item}"></option>`;}).join(' ');
    const offersForSelect = this.getOfferTemplate(offers);
    const pointPictures = getPictureTemplate(pictures);
    return `<li class="trip-events__item">
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
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
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
    </form>
    </li>`;
  }

  _editingFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.editingFormSubmit();
  }

  _rollupButtonClickHandler() {
    this._callback.rollupButtonClick();
  }

  _groupTypeChangeHandler(evt) {
    this._callback.groupTypeChange(evt);
  }

  _inputEventDestinationChangeHandler(evt) {
    this._callback.inputEventDestinationChange(evt);
  }

  setEditingFormSubmitHandler(callback) {
    this._callback.editingFormSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._editingFormSubmitHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupButtonClickHandler);
  }

  setGroupTypeChangeHandler(callback) {
    this._callback.groupTypeChange = callback;
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._groupTypeChangeHandler);
  }

  setInputEventDestinationChangeHandler(callback) {
    this._callback.inputEventDestinationChange = callback;
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._inputEventDestinationChangeHandler);
  }

  setCalendarFormInput() {
    const eventTimeInput = this.getElement().querySelectorAll('.event__input--time');
    if (eventTimeInput.length > 0) {
      eventTimeInput.forEach((item) => {
        flatpickr(item, {
          enableTime: true,
          dateFormat: 'y/m/d H:i',
        });
      });
    }
  }
}
