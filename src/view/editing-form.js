import SmartView from './smart.js';
import {capitalizeFirstLetter, checkOfferTypes} from '../utils/common.js';
import {changeDateFormat, flatpickr, dayjs} from '../utils/date.js';
import {getPictureTemplate} from './get-picture-template.js';
import {getSelectedDestinationData} from '../utils/render.js';
import {getOfferTemplate} from './get-offer-template.js';
import {getDestinationTemplate} from './get-destination-template.js';
import {UpdateType, State} from '../utils/const';
import {toast} from '../utils/toast';
import he from 'he';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

export default class EditingForm extends SmartView {
  constructor(point, destinationsModel, offersPointModel) {
    super();
    this._point = point;
    this._destinationsModel = destinationsModel;
    this._offersPointModel = offersPointModel;
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
    this._modelOffersEventHandler = this._modelOffersEventHandler.bind(this);
    this._modelDestinationsEventHandler = this._modelDestinationsEventHandler.bind(this);

    this._offersPointModel.addObserver(this._modelOffersEventHandler);
    this._destinationsModel.addObserver(this._modelDestinationsEventHandler);
  }

  _getOfferTemplate(pointOffers) {
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

  _getDestinationForSelect(destinationNames) {
    return destinationNames.map((item) => {return `<option value="${item}"></option>`;}).join(' ');
  }

  _getTypesForSelect(allOffers) {
    return allOffers.map((item) => {return `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalizeFirstLetter(item)}</label>
      </div>`;}).join(' ');
  }

  getTemplate() {
    const {type, dateFrom, dateTo, basePrice, destination, offers} = this._point;
    const {name, description, pictures} = destination;
    const typeWaypoint = capitalizeFirstLetter(type);
    const eventDateAttributeValueFrom = changeDateFormat(dateFrom, 'YY/MM/DD HH:mm');
    const eventDateAttributeValueTo = changeDateFormat(dateTo, 'YY/MM/DD HH:mm');
    const pointPictures = getPictureTemplate(pictures);

    let typeOffers = offers;
    let typesForSelect = '';
    let destinationForSelect = '';
    const isLoadingOffers = this._offersPointModel.isLoading;
    const isLoadingDestinations = this._destinationsModel.isLoading;
    let offersForSelect = this._getOfferTemplate(typeOffers);

    if (!isLoadingOffers) {
      this._offersPointModel.removeObserver();
      typeOffers = this._offersPointModel.getDataItems();
      const allOffers = typeOffers.map(({type}) => type);
      typesForSelect = this._getTypesForSelect(allOffers);
      const checkedOffers = checkOfferTypes(type, typeOffers);
      offersForSelect = this._getOfferTemplate(checkedOffers);
    }

    if (!isLoadingDestinations) {
      this._destinationsModel.removeObserver();
      const destinationNames = this._destinationsModel.getDataItems().map(({name}) => name);
      destinationForSelect = this._getDestinationForSelect(destinationNames);
    }

    return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isLoadingOffers ? 'disabled' : ''}>
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
          <input class="event__input event__input--destination" id="event-destination-1" required type="text" ${isLoadingDestinations ? 'disabled' : ''} name="event-destination" value="${he.encode(name)}" list="destination-list-1">
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

  _removeModelEventsHandler() {
    this._offersPointModel.removeObserver();
    this._destinationsModel.removeObserver();
  }

  _modelOffersEventHandler(updateType) {
    if (updateType === UpdateType.INIT) {
      const fieldContainer = this.getElement().querySelector('.event__type-group');
      const typeOffers = this._offersPointModel.getDataItems();
      const allOffers = typeOffers.map(({type}) => type);
      const selectTypeInput = this.getElement().querySelector('#event-type-toggle-1');
      selectTypeInput.disabled = false;
      fieldContainer.innerHTML = `<legend class="visually-hidden">Event type</legend>${this._getTypesForSelect(allOffers)}`;

      const typePoint = this._point.type;
      const pointOffers = this._point.offers;

      const offers = checkOfferTypes(typePoint, typeOffers);
      getOfferTemplate(offers, this._offersPointModel.isLoading, pointOffers);
      this._setInputOfferClickHandler();
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

  _groupTypeChangeHandler(evt) {
    if (this._offersPointModel.isLoading) {
      return;
    }

    this._isPreviousPoint = false;
    const offers = checkOfferTypes(evt.target.value, this._offersPointModel.getDataItems());
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
    this._editedPoint.destination = Object.assign({}, {name: evt.target.value}, destination);
  }

  _inputTimeStartChangeHandler(evt) {
    const endTimeInput = document.querySelector('#event-end-time-1');
    const saveButton = document.querySelector('.event__save-btn');
    const formattedEndTime = dayjs(endTimeInput.value, 'YY/MM/DD HH:mm');
    const formattedStartTime = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
    const diffTime = dayjs(formattedEndTime).diff(formattedStartTime, 'm');
    if (diffTime < 0) {
      saveButton.disabled = true;
      toast('Date from shouldn\'t be later than date to');
      return;
    }
    this._editedPoint.dateFrom = formattedStartTime;
    saveButton.disabled = false;
  }

  _inputTimeEndChangeHandler(evt) {
    const startTimeInput = document.querySelector('#event-start-time-1');
    const saveButton = document.querySelector('.event__save-btn');
    const formattedStartTime = dayjs(startTimeInput.value, 'YY/MM/DD HH:mm');
    const formattedEndTime = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
    const diffTime = dayjs(formattedEndTime).diff(formattedStartTime, 'm');
    if (diffTime < 0) {
      saveButton.disabled = true;
      toast('Date from shouldn\'t be later than date to');
      return;
    }
    this._editedPoint.dateTo = formattedEndTime;
    saveButton.disabled = false;
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
    this._removeModelEventsHandler();
    this._removeCalendarFormInput();
    this._callback.buttonDeleteClick(this._point);
  }

  setButtonDeleteClickHandler(callback) {
    this._callback.buttonDeleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._buttonDeleteClickHandler);
  }

  setFormState(state) {
    const creatingFormSaveButton = this.getElement().querySelector('.event__save-btn');
    const creatingFormDeleteButton = this.getElement().querySelector('.event__reset-btn');
    const creatingFormInputs = this.getElement().querySelectorAll('input');

    switch (state) {
      case State.SAVING:
        creatingFormSaveButton.disabled = true;
        creatingFormSaveButton.textContent = 'Saving...';
        creatingFormInputs.forEach((element) => element.disabled = true);
        break;
      case State.DELETING:
        creatingFormDeleteButton.disabled = true;
        creatingFormDeleteButton.textContent = 'Deleting...';
        creatingFormInputs.forEach((element) => element.disabled = true);
        break;
      case State.ABORTING:
        creatingFormDeleteButton.disabled = false;
        creatingFormSaveButton.textContent = 'Save';
        creatingFormDeleteButton.disabled = false;
        creatingFormDeleteButton.textContent = 'Delete';
        this.shake();
        break;
    }
  }
}
