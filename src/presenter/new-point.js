import CreatingFormView from '../view/creating-form.js';
import {checkOfferTypes, isOnline} from '../utils/common.js';
import {getSelectedDestinationData, render, RenderPosition, completelyRemove} from '../utils/render.js';
import {getOfferTemplate} from '../view/get-offer-template.js';
import {getDestinationTemplate} from '../view/get-destination-template.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {dayjs} from '../utils/date.js';
import {toast} from '../utils/toast';

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
      dateFrom: dayjs().startOf('month'),
      dateTo: dayjs().startOf('month'),
      type: null,
      destination: null,
      isFavorite: false,
      offers: [],
    };
    this._defaultPoint = Object.assign({}, this._createdPoint);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._inputEventDestinationChangeHandler = this._inputEventDestinationChangeHandler.bind(this);
    this._creatingFormSubmitHandler = this._creatingFormSubmitHandler.bind(this);
    this._inputOfferClickHandler = this._inputOfferClickHandler.bind(this);
    this._inputTimeStartChangeHandler = this._inputTimeStartChangeHandler.bind(this);
    this._inputTimeEndChangeHandler = this._inputTimeEndChangeHandler.bind(this);
    this._inputBasePriceChangeHandler = this._inputBasePriceChangeHandler.bind(this);
    this._buttonCancelClickHandler = this._buttonCancelClickHandler.bind(this);
  }

  init() {
    this._creatingFormComponent = new CreatingFormView(this._destinationsModel, this._offersPointModel);
    this._creatingFormComponent.setGroupTypeChangeHandler(this._groupTypeChangeHandler);
    this._creatingFormComponent.setInputEventDestinationChangeHandler(this._inputEventDestinationChangeHandler);
    this._creatingFormComponent.setInputTimeStartChangeHandler(this._inputTimeStartChangeHandler);
    this._creatingFormComponent.setInputTimeEndChangeHandler(this._inputTimeEndChangeHandler);
    this._creatingFormComponent.setCalendarFormInput();
    this._creatingFormComponent.setInputBasePriceHandler(this._inputBasePriceChangeHandler);
    this._creatingFormComponent.setCreatingFormSubmitHandler(this._creatingFormSubmitHandler);
    this._creatingFormComponent.setButtonCancelClickHandler(this._buttonCancelClickHandler);

    this._buttonElement.disabled = true;
    document.addEventListener('keydown', this._escKeyDownHandler);
    render(this._container, this._creatingFormComponent, RenderPosition.AFTERBEGIN);
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
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._createdPoint = this._defaultPoint;
  }

  _escKeyDownHandler(evt) {
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
    this._creatingFormComponent.setInputOfferClickHandler(this._inputOfferClickHandler);
  }

  _inputOfferClickHandler(evt) {
    const selectedOfferIndex = this._createdPoint.offers.findIndex((item) => item.title === evt.target.dataset.title);
    if (evt.target.checked && selectedOfferIndex === -1) {
      this._createdPoint.offers.splice(0, 0, {title: evt.target.dataset.title, price: Number(evt.target.dataset.price)});
    } else if (selectedOfferIndex !== -1) {
      this._createdPoint.offers.splice(selectedOfferIndex, 1);
    }
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
    this._createdPoint.dateFrom = formattedStartTime;
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
    this._createdPoint.dateTo = formattedEndTime;
    saveButton.disabled = false;
  }

  _inputBasePriceChangeHandler(evt) {
    this._createdPoint.basePrice = Number(evt.target.value);
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
    this._createdPoint.destination = Object.assign({}, {name: evt.target.value}, destination);
  }

  _creatingFormSubmitHandler() {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }
    const isNotCompletelyField = Object.values(this._createdPoint).some((value) => value === null);
    if (isNotCompletelyField) {
      this.removeCreatingForm();
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
  }


}
