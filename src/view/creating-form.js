import SmartView from './smart.js';
import {capitalizeFirstLetter} from '../utils/common.js';
import {flatpickr} from '../utils/date.js';


export default class CreatingForm extends SmartView {
  constructor(destinations, offersPoint) {
    super();
    this._offersPoint = offersPoint;
    this._destinations = destinations;
    this._creatingFormSubmitHandler = this._creatingFormSubmitHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._inputEventDestinationChangeHandler = this._inputEventDestinationChangeHandler.bind(this);
    this._inputOfferClickHandler = this._inputOfferClickHandler.bind(this);
    this._inputTimeStartChangeHandler = this._inputTimeStartChangeHandler.bind(this);
    this._inputTimeEndChangeHandler = this._inputTimeEndChangeHandler.bind(this);
    this._inputBasePriceChangeHandler = this._inputBasePriceChangeHandler.bind(this);
  }

  getTemplate() {
    const names = this._destinations.map(({name}) => name);
    const offerTypes = this._offersPoint.map(({type}) => type);
    const offerTypesTemplate = offerTypes.map((item) => {
      return `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalizeFirstLetter(item)}</label>
      </div>`;}).join(' ');
    const nameDestinationsTemplate = names.map((item) => {return `<option value="${item}"></option>`;}).join(' ');
    return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${offerTypesTemplate}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            Flight
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
          <datalist id="destination-list-1">
            ${nameDestinationsTemplate}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers"></div>
        </section>
        <section class="event__section  event__section--destination visually-hidden">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description"></p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
  }

  _creatingFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.creatingFormSubmit();
  }

  _groupTypeChangeHandler(evt) {
    this._callback.groupTypeChange(evt);
  }

  _inputEventDestinationChangeHandler(evt) {
    this._callback.inputEventDestinationChange(evt);
  }

  _inputOfferClickHandler(evt) {
    this._callback.inputOfferClick(evt);
  }

  _inputTimeStartChangeHandler(evt) {
    this._callback.inputTimeStartChange(evt);
  }

  _inputTimeEndChangeHandler(evt) {
    this._callback.inputTimeEndChange(evt);
  }

  _inputBasePriceChangeHandler(evt) {
    this._callback.inputBasePriceChange(evt);
  }

  setCreatingFormSubmitHandler(callback) {
    this._callback.creatingFormSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._creatingFormSubmitHandler);
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

  setInputOfferClickHandler(callback) {
    this._callback.inputOfferClick = callback;
    this.getElement().querySelector('.event__details').addEventListener('change', this._inputOfferClickHandler);
  }

  setInputTimeStartChangeHandler(callback) {
    this._callback.inputTimeStartChange = callback;
    this.getElement().querySelector('#event-start-time-1').addEventListener('input', this._inputTimeStartChangeHandler);
  }

  setInputTimeEndChangeHandler(callback) {
    this._callback.inputTimeEndChange = callback;
    this.getElement().querySelector('#event-end-time-1').addEventListener('input', this._inputTimeEndChangeHandler);
  }

  setInputBasePriceHandler(callback) {
    this._callback.inputBasePriceChange = callback;
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._inputBasePriceChangeHandler);
  }
}
