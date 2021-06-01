import SmartView from './smart.js';
import {capitalizeFirstLetter, checkOfferTypes, isOnline} from '../utils/common.js';
import {flatpickr, dayjs, changeDateFormat} from '../utils/date.js';
import he from 'he';
import {UpdateType, State, UserAction} from '../utils/const';
import {getOfferTemplate} from './get-offer-template';
import {toast} from '../utils/toast';
import {getSelectedDestinationData} from '../utils/render';
import {getDestinationTemplate} from './get-destination-template';

const DEFAULT_TYPE = 'flight';

export default class CreatingForm extends SmartView {
  constructor(destinationsModel, offersPointModel, changeData) {
    super();
    this._offersPointModel = offersPointModel;
    this._destinationsModel = destinationsModel;
    this._changeData = changeData;
    this._datepicker = [];
    this._createdPoint = {
      basePrice: null,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      type: DEFAULT_TYPE,
      destination: null,
      isFavorite: false,
      offers: [],
    };

    this._creatingFormSubmitHandler = this._creatingFormSubmitHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._timeStartInputHandler = this._timeStartInputHandler.bind(this);
    this._timeEndInputHandler = this._timeEndInputHandler.bind(this);
    this._basePriceInputHandler = this._basePriceInputHandler.bind(this);
    this._buttonCancelClickHandler = this._buttonCancelClickHandler.bind(this);
    this._modelOffersEventHandler = this._modelOffersEventHandler.bind(this);
    this._modelDestinationsEventHandler = this._modelDestinationsEventHandler.bind(this);

    this._offersPointModel.addObserver(this._modelOffersEventHandler);
    this._destinationsModel.addObserver(this._modelDestinationsEventHandler);
  }

  getTemplate() {
    const defaultDate = changeDateFormat(dayjs(), 'YY/MM/DD HH:mm');
    const typeWaypoint = capitalizeFirstLetter(DEFAULT_TYPE);
    let typesForSelect = '';
    let nameDestinationsTemplate = '';
    let offersForSelect = '';

    const isLoadingOffers = this._offersPointModel.isLoading;
    const isLoadingDestinations = this._destinationsModel.isLoading;

    if (!isLoadingOffers) {
      this._offersPointModel.removeObserver();
      const typeOffers = this._offersPointModel.getDataItems();
      const allOffers = typeOffers.map(({type}) => type);
      typesForSelect = this._getTypesForSelect(allOffers);
      const checkedOffers = checkOfferTypes(DEFAULT_TYPE, typeOffers);
      offersForSelect = this._getOfferTemplate(checkedOffers);
    }

    if (!isLoadingDestinations) {
      this._destinationsModel.removeObserver();
      const names = this._destinationsModel.getDataItems().map(({name}) => name);
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
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" value="${DEFAULT_TYPE}" type="checkbox" ${isLoadingOffers ? 'disabled' : ''}>
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesForSelect}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeWaypoint}
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
        <section class="event__section  event__section--offers ${offersForSelect ? '' : 'visually-hidden'}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersForSelect}
          </div>
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

  removeCalendarFormInput() {
    if (this._datepicker.length) {
      this._datepicker.forEach((datepicker) => datepicker.destroy());
      this._datepicker = [];
    }
  }

  setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._groupTypeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._eventDestinationChangeHandler);
    this.getElement().querySelector('#event-start-time-1').addEventListener('input', this._timeStartInputHandler);
    this.getElement().querySelector('#event-end-time-1').addEventListener('input', this._timeEndInputHandler);
    this._setCalendarFormInput();
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._basePriceInputHandler);
    this.getElement().querySelector('form').addEventListener('submit', this._creatingFormSubmitHandler);
  }

  setFormState(state) {
    const creatingFormSaveButton = this.getElement().querySelector('.event__save-btn');
    const creatingFormInputs = this.getElement().querySelectorAll('input');

    switch (state) {
      case State.SAVING:
        creatingFormSaveButton.disabled = true;
        creatingFormSaveButton.textContent = 'Saving...';
        creatingFormInputs.forEach((element) => element.disabled = true);
        break;
      case State.ABORTING:
        this.shake();
        break;
    }
  }

  _setCalendarFormInput() {
    if (this._datepicker.length) {
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

  setOfferChangeHandler() {
    this.getElement().querySelector('.event__details').addEventListener('change', this._offerChangeHandler);
  }

  setButtonCancelClickHandler(callback) {
    this._callback.buttonCancelClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._buttonCancelClickHandler);
  }

  _getDestinationForSelect(destinationNames) {
    return destinationNames.map((item) => {return `<option value="${he.encode(item)}"></option>`;}).join(' ');
  }

  _getOfferTemplate(pointOffers) {
    if (pointOffers) {
      const templates = pointOffers.map(({title, price}) => {
        const offerTitle = [title].join('-');
        return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" data-title="${title}" data-price="${price}" id="event-offer-${offerTitle}-1" type="checkbox" name="event-offer">
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

  _getTypesForSelect(allOffers) {
    return allOffers.map((item) => {return `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalizeFirstLetter(item)}</label>
      </div>`;}).join(' ');
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
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }
    this._changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      this._createdPoint,
    );
  }

  _groupTypeChangeHandler(evt) {
    if (this._offersPointModel.isLoading) {
      return;
    }

    const offers = checkOfferTypes(evt.target.value, this._offersPointModel.getDataItems());
    getOfferTemplate(offers);

    const eventTypeIcon = this.getElement().querySelector('.event__type-icon');
    eventTypeIcon.src = `img/icons/${evt.target.value}.png`;

    const typeOutput = this.getElement().querySelector('.event__type-output');
    typeOutput.textContent = evt.target.value;

    const inputTypeToggle = this.getElement().querySelector('.event__type-toggle');
    inputTypeToggle.required = false;

    this._createdPoint.offers = [];
    this._createdPoint.type = evt.target.value;
  }

  _eventDestinationChangeHandler(evt) {
    if (this._destinationsModel.isLoading) {
      return;
    }
    const destinations = this._destinationsModel.getDataItems();
    const isValidDestination = destinations.some(({name}) => name === evt.target.value);
    if (!isValidDestination) {
      evt.target.value = '';
      return;
    }

    const destination = getSelectedDestinationData(evt.target.value, destinations);
    getDestinationTemplate(destination);
    this._createdPoint.destination = Object.assign({}, {name: evt.target.value}, destination);
  }

  _offerChangeHandler(evt) {
    const selectedOfferIndex = this._createdPoint.offers.findIndex((item) => item.title === evt.target.dataset.title);
    if (evt.target.checked && selectedOfferIndex === -1) {
      this._createdPoint.offers.splice(0, 0, {title: evt.target.dataset.title, price: Number(evt.target.dataset.price)});
    } else if (selectedOfferIndex !== -1) {
      this._createdPoint.offers.splice(selectedOfferIndex, 1);
    }
  }

  _timeStartInputHandler(evt) {
    const endTimeInput = this.getElement().querySelector('#event-end-time-1');
    const saveButton = this.getElement().querySelector('.event__save-btn');
    const formattedEndTime = dayjs(endTimeInput.value, 'YY/MM/DD HH:mm');
    const formattedStartTime = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
    const diffTime = dayjs(formattedEndTime).diff(formattedStartTime, 'm');
    this._createdPoint.dateFrom = formattedStartTime;
    if (!evt.target.value.length || !endTimeInput.value.length) {
      saveButton.disabled = true;
      toast('The input date field must not be empty');
      return;
    }
    if (diffTime < 0) {
      saveButton.disabled = true;
      toast('Date from shouldn\'t be later than date to');
      return;
    }
    saveButton.disabled = false;
  }

  _timeEndInputHandler(evt) {
    const startTimeInput = this.getElement().querySelector('#event-start-time-1');
    const saveButton = this.getElement().querySelector('.event__save-btn');
    const formattedStartTime = dayjs(startTimeInput.value, 'YY/MM/DD HH:mm');
    const formattedEndTime = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
    const diffTime = dayjs(formattedEndTime).diff(formattedStartTime, 'm');
    this._createdPoint.dateTo = formattedEndTime;
    if (!evt.target.value.length || !startTimeInput.value.length) {
      saveButton.disabled = true;
      toast('The input date field must not be empty');
      return;
    }
    if (diffTime < 0) {
      saveButton.disabled = true;
      toast('Date from shouldn\'t be later than date to');
      return;
    }
    saveButton.disabled = false;
  }

  _basePriceInputHandler(evt) {
    this._createdPoint.basePrice = Number(evt.target.value);
  }

  _buttonCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonCancelClick(evt);
  }
}
