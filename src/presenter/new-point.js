import CreatingFormView from '../view/creating-form.js';
import {checkOfferTypes, isOnline} from '../utils/common.js';
import {getSelectedDestinationData, render, RenderPosition, completelyRemove} from '../utils/render.js';
import {getOfferTemplate} from '../view/get-offer-template.js';
import {getDestinationTemplate} from '../view/get-destination-template.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {dayjs} from '../utils/date.js';
import {toast} from '../utils/toast';

const DEFAULT_TYPE = 'flight';

export default class NewPoint {
  constructor(newPointArguments) {
    const {container, buttonElement, destinationsModel, offersPointModel, changeData} = newPointArguments;
    this._container = container;
    this._destinationsModel = destinationsModel;
    this._offersPointModel = offersPointModel;
    this._buttonElement = buttonElement;
    this._changeData = changeData;
    this._creatingFormComponent = null;
    this._createdPoint = {
      basePrice: null,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      type: DEFAULT_TYPE,
      destination: null,
      isFavorite: false,
      offers: [],
    };

    this._creatingFormEscKeyDownHandler = this._creatingFormEscKeyDownHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);
    this._creatingFormSubmitHandler = this._creatingFormSubmitHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._timeStartInputHandler = this._timeStartInputHandler.bind(this);
    this._timeEndInputHandler = this._timeEndInputHandler.bind(this);
    this._basePriceInputHandler = this._basePriceInputHandler.bind(this);
    this._buttonCancelClickHandler = this._buttonCancelClickHandler.bind(this);
  }

  init() {
    this._creatingFormComponent = new CreatingFormView(this._destinationsModel, this._offersPointModel);
    this._creatingFormComponent.setGroupTypeChangeHandler(this._groupTypeChangeHandler);
    this._creatingFormComponent.setEventDestinationChangeHandler(this._eventDestinationChangeHandler);
    this._creatingFormComponent.setTimeStartInputHandler(this._timeStartInputHandler);
    this._creatingFormComponent.setTimeEndInputHandler(this._timeEndInputHandler);
    this._creatingFormComponent.setCalendarFormInput();
    this._creatingFormComponent.setBasePriceInputHandler(this._basePriceInputHandler);
    this._creatingFormComponent.setCreatingFormSubmitHandler(this._creatingFormSubmitHandler);
    this._creatingFormComponent.setButtonCancelClickHandler(this._buttonCancelClickHandler);
    this._buttonElement.disabled = true;
    document.addEventListener('keydown', this._creatingFormEscKeyDownHandler);
    render(this._container, this._creatingFormComponent, RenderPosition.AFTERBEGIN);
    this._creatingFormComponent.setOfferChangeHandler(this._offerChangeHandler);
  }

  setViewState(state) {
    this._creatingFormComponent.setFormState(state);
    this._destinationsModel.removeObserver();
    this._offersPointModel.removeObserver();
  }

  removeCreatingForm() {
    if (this._creatingFormComponent === null) {
      return;
    }
    this._creatingFormComponent.removeCalendarFormInput();
    this._offersPointModel.removeObserver();
    this._destinationsModel.removeObserver();
    completelyRemove(this._creatingFormComponent);
    this._creatingFormComponent = null;
    this._buttonElement.disabled = false;
    document.removeEventListener('keydown', this._creatingFormEscKeyDownHandler);
    this._createdPoint = this._resetCreatedPointItems();
  }

  _creatingFormEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.removeCreatingForm();
      this._destinationsModel.removeObserver();
      this._offersPointModel.removeObserver();
    }
  }

  _groupTypeChangeHandler(evt) {
    if (this._offersPointModel.isLoading) {
      return;
    }

    const offers = checkOfferTypes(evt.target.value, this._offersPointModel.getDataItems());
    getOfferTemplate(offers);

    const eventTypeIcon = this._creatingFormComponent.getElement().querySelector('.event__type-icon');
    eventTypeIcon.src = `img/icons/${evt.target.value}.png`;

    const typeOutput = this._creatingFormComponent.getElement().querySelector('.event__type-output');
    typeOutput.textContent = evt.target.value;

    const inputTypeToggle = this._creatingFormComponent.getElement().querySelector('.event__type-toggle');
    inputTypeToggle.required = false;

    this._createdPoint.offers = [];
    this._createdPoint.type = evt.target.value;
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
    const endTimeInput = document.querySelector('#event-end-time-1');
    const saveButton = document.querySelector('.event__save-btn');
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

  _resetCreatedPointItems() {
    return {
      basePrice: null,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      type: DEFAULT_TYPE,
      destination: null,
      isFavorite: false,
      offers: [],
    };
  }

  _timeEndInputHandler(evt) {
    const startTimeInput = document.querySelector('#event-start-time-1');
    const saveButton = document.querySelector('.event__save-btn');
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

  _creatingFormSubmitHandler() {
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

  _buttonCancelClickHandler() {
    this.removeCreatingForm();
    document.removeEventListener('keydown', this._creatingFormEscKeyDownHandler);
  }
}
