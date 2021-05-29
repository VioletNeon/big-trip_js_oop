import SmartView from './smart.js';
import {capitalizeFirstLetter} from '../utils/common.js';
import {flatpickr, dayjs, changeDateFormat} from '../utils/date.js';
import he from 'he';
import {UpdateType} from '../utils/const';


export default class CreatingForm extends SmartView {
  constructor(destinationsModel, offersPointModel) {
    super();
    this._offersPointModel = offersPointModel;
    this._destinationsModel = destinationsModel;
    this._datepicker = [];
    this._creatingFormSubmitHandler = this._creatingFormSubmitHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._inputEventDestinationChangeHandler = this._inputEventDestinationChangeHandler.bind(this);
    this._inputOfferClickHandler = this._inputOfferClickHandler.bind(this);
    this._inputTimeStartChangeHandler = this._inputTimeStartChangeHandler.bind(this);
    this._inputTimeEndChangeHandler = this._inputTimeEndChangeHandler.bind(this);
    this._inputBasePriceChangeHandler = this._inputBasePriceChangeHandler.bind(this);
    this._buttonCancelClickHandler = this._buttonCancelClickHandler.bind(this);
    this._modelOffersEventHandler = this._modelOffersEventHandler.bind(this);
    this._modelDestinationsEventHandler = this._modelDestinationsEventHandler.bind(this);

    this._offersPointModel.addObserver(this._modelOffersEventHandler);
    this._destinationsModel.addObserver(this._modelDestinationsEventHandler);
  }

  _getDestinationForSelect(destinationNames) {
    return destinationNames.map((item) => {return `<option value="${he.encode(item)}"></option>`;}).join(' ');
  }

  _getTypesForSelect(allOffers) {
    return allOffers.map((item) => {return `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalizeFirstLetter(item)}</label>
      </div>`;}).join(' ');
  }

  getTemplate() {
    const names = this._destinationsModel.getDataItems().map(({name}) => name);
    const allOffers = this._offersPointModel.getDataItems().map(({type}) => type);
    const defaultDate = changeDateFormat(dayjs(), 'YY/MM/DD HH:mm');
    let offerTypesTemplate = '';
    let nameDestinationsTemplate = '';

    const isLoadingOffers = this._offersPointModel.isLoading;
    const isLoadingDestinations = this._destinationsModel.isLoading;

    if (!isLoadingOffers) {
      offerTypesTemplate = this._getTypesForSelect(allOffers);
    }
    if (!isLoadingDestinations) {
      nameDestinationsTemplate = this._getDestinationForSelect(names);
    }

    return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isLoadingOffers ? 'disabled' : ''} required>
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${offerTypesTemplate}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" ${isLoadingDestinations ? 'disabled' : ''} name="event-destination" value="" list="destination-list-1">
          <datalist id="destination-list-1">
            ${nameDestinationsTemplate}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${defaultDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${defaultDate}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" required id="event-price-1" type="number" min="0" name="event-price" value="">
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

  _modelOffersEventHandler(updateType) {
    if (updateType === UpdateType.INIT) {
      const fieldContainer = this.getElement().querySelector('.event__type-group');
      const typeOffers = this._offersPointModel.getDataItems();
      const allOffers = typeOffers.map(({type}) => type);
      const selectTypeInput = this.getElement().querySelector('#event-type-toggle-1');
      selectTypeInput.disabled = false;
      fieldContainer.innerHTML = `<legend class="visually-hidden">Event type</legend>${this._getTypesForSelect(allOffers)}`;
    }
  }

  _modelDestinationsEventHandler(updateType) {
    if (updateType === UpdateType.INIT) {
      const optionsContainer = this.getElement().querySelector('#destination-list-1');
      const destinationNames = this._destinationsModel.getDataItems().map(({name}) => name);
      const selectDestinationInput = this.getElement().querySelector('#event-destination-1');
      selectDestinationInput.disabled = false;
      optionsContainer.innerHTML = '';
      optionsContainer.innerHTML = `${this._getDestinationForSelect(destinationNames)}`;
    }
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

  _buttonCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonCancelClick(evt);
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

  removeCalendarFormInput() {
    if (this._datepicker.length > 0) {
      this._datepicker.forEach((datepicker) => datepicker.destroy());
      this._datepicker = [];
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

  setButtonCancelClickHandler(callback) {
    this._callback.buttonCancelClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._buttonCancelClickHandler);
  }
}
