import SmartView from './smart.js';
import {capitalizeFirstLetter, checkOfferTypes} from '../utils/common.js';
import {changeDateFormat, flatpickr, dayjs} from '../utils/date.js';
import {getPictureTemplate} from './get-picture-template.js';
import {getSelectedDestinationData} from '../utils/render.js';
import {getOfferTemplate} from './get-offer-template.js';
import {getDestinationTemplate} from './get-destination-template.js';
import he from 'he';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

export default class EditingForm extends SmartView {
  constructor(point, destinations, offersPoint) {
    super();
    this._point = point;
    this._destinations = destinations;
    this._offersPoint = offersPoint;
    this._isPreviousPoint = true;
    this._datepicker = [];
    this._editedPoint = {
      basePrice: point.basePrice,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      type: point.type,
      destination: point.destination,
      offers: point.offers,
    };
    this._editingFormSubmitHandler = this._editingFormSubmitHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._inputTimeStartChangeHandler = this._inputTimeStartChangeHandler.bind(this);
    this._inputTimeEndChangeHandler = this._inputTimeEndChangeHandler.bind(this);
    this._inputEventDestinationChangeHandler = this._inputEventDestinationChangeHandler.bind(this);
    this._rollDownButtonClickHandler = this._rollDownButtonClickHandler.bind(this);
    this._inputOfferClickHandler = this._inputOfferClickHandler.bind(this);
    this._inputBasePriceChangeHandler = this._inputBasePriceChangeHandler.bind(this);
    this._buttonDeleteClickHandler = this._buttonDeleteClickHandler.bind(this);
  }

  getOfferTemplate(pointOffers) {
    if (pointOffers) {
      const templates = pointOffers.map(({title, price}) => {
        const isSelectedOffer = this._point.offers.map((item) => item.title).includes(title);
        const offerTitle = [title].join('-');
        return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" data-title="${title}" data-price="${price}" id="event-offer-${offerTitle}-1" ${this._isPreviousPoint && isSelectedOffer ? 'checked' : ''} type="checkbox" name="event-offer">
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
    const {type, dateFrom, dateTo, basePrice, destination} = this._point;
    const offers = checkOfferTypes(type, this._offersPoint);
    const {name, description, pictures} = destination;
    const destinationNames = this._destinations.map(({name}) => name);
    const allOffers = this._offersPoint.map(({type}) => type);
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
          <input class="event__input event__input--destination" id="event-destination-1" required type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-1">
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
          <input class="event__input  event__input--price" id="event-price-1" min="0" required type="number" name="event-price" value="${basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
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

  removeElement() {
    super.removeElement();

    this._removeCalendarFormInput();
  }

  _editingFormSubmitHandler(evt) {
    evt.preventDefault();
    this._removeCalendarFormInput();
    this.updateData(this._editedPoint, true);
    this._isPreviousPoint = true;
    this._callback.editingFormSubmit(this._point);
  }

  _groupTypeChangeHandler(evt) {
    this._isPreviousPoint = false;
    const offers = checkOfferTypes(evt.target.value, this._offersPoint);
    getOfferTemplate(offers);

    const eventTypeIcon = this.getElement().querySelector('.event__type-icon');
    eventTypeIcon.src = `img/icons/${evt.target.value}.png`;

    const typeOutput = this.getElement().querySelector('.event__type-output');
    typeOutput.textContent = evt.target.value;
    this._editedPoint.offers = [];
    this._editedPoint.type = evt.target.value;
    this._setInputOfferClickHandler();
  }

  _inputOfferClickHandler(evt) {
    const selectedOfferIndex = this._editedPoint.offers.findIndex((item) => item.title === evt.target.dataset.title);
    if (evt.target.checked && selectedOfferIndex === -1) {
      this._editedPoint.offers.splice(0, 0, {title: evt.target.dataset.title, price: Number(evt.target.dataset.price)});
    } else if (selectedOfferIndex !== -1) {
      this._editedPoint.offers.splice(selectedOfferIndex, 1);
    }
  }

  _setInputOfferClickHandler() {
    this.getElement().querySelector('.event__details').addEventListener('change', this._inputOfferClickHandler);
  }

  _inputEventDestinationChangeHandler(evt) {
    const destination = getSelectedDestinationData(evt.target.value, this._destinations);
    getDestinationTemplate(destination);
    this._editedPoint.destination = Object.assign({}, {name: evt.target.value}, destination);
  }

  _inputTimeStartChangeHandler(evt) {
    this._editedPoint.dateFrom = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
  }

  _inputTimeEndChangeHandler(evt) {
    this._editedPoint.dateTo = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
  }

  _inputBasePriceChangeHandler(evt) {
    this._editedPoint.basePrice = Number(evt.target.value);
  }

  _rollDownButtonClickHandler() {
    this._removeCalendarFormInput();
    this._isPreviousPoint = true;
    this._callback.rollDownButtonClick();
  }

  setEditingFormSubmitHandler(callback) {
    this._callback.editingFormSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._editingFormSubmitHandler);
  }

  setRollDownButtonClickHandler(callback) {
    this._callback.rollDownButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollDownButtonClickHandler);
  }

  setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._groupTypeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._inputEventDestinationChangeHandler);
    this.getElement().querySelector('#event-start-time-1').addEventListener('input', this._inputTimeStartChangeHandler);
    this.getElement().querySelector('#event-end-time-1').addEventListener('input', this._inputTimeEndChangeHandler);
    this._setInputOfferClickHandler();
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._inputBasePriceChangeHandler);
    this._setCalendarFormInput();
  }

  reset(point) {
    this.updateData(
      point,
    );
  }

  _setCalendarFormInput() {
    if (this._datepicker.length > 0) {
      this._datepicker.forEach((datepicker) => datepicker.destroy());
      this._datepicker = [];
    }
    const eventTimeInput = this.getElement().querySelectorAll('.event__input--time');
    eventTimeInput.forEach((item) => {
      this._datepicker.push(flatpickr(item, {
        enableTime: true,
        dateFormat: 'y/m/d H:i',
      }));
    });
  }

  _removeCalendarFormInput() {
    if (this._datepicker.length > 0) {
      this._datepicker.forEach((datepicker) => datepicker.destroy());
      this._datepicker = [];
    }
  }

  _buttonDeleteClickHandler(evt) {
    evt.preventDefault();
    this._removeCalendarFormInput();
    this._callback.buttonDeleteClick(this._point);
  }

  setButtonDeleteClickHandler(callback) {
    this._callback.buttonDeleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._buttonDeleteClickHandler);
  }

}
