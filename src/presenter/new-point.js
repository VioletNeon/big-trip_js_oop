import CreatingFormView from '../view/creating-form';
import {checkOfferTypes, getIdentifier} from '../utils/common.js';
import {getSelectedDestinationData, render, RenderPosition, completelyRemove} from '../utils/render.js';
import {getOfferTemplate} from '../view/get-offer-template';
import {getDestinationTemplate} from '../view/get-destination-template';
import {Mode} from '../utils/const.js';
import {dayjs} from '../utils/date';

const newPointId = getIdentifier();

export default class NewPoint {
  constructor(container, buttonElement, destinations, offersPoint) {
    this._container = container;
    this._destinations = destinations;
    this._offersPoint = offersPoint;
    this._buttonElement = buttonElement;
    this._creatingFormComponent = new CreatingFormView(this._destinations, this._offersPoint);
    this._mode = Mode.DEFAULT;
    this._createdPoint = {
      basePrice: null,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      type: null,
      destination: null,
      isFavorite: false,
      offers: [],
      id: '0' + newPointId(),
    };

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._inputEventDestinationChangeHandler = this._inputEventDestinationChangeHandler.bind(this);
    this._creatingFormSubmitHandler = this._creatingFormSubmitHandler.bind(this);
    this._inputOfferClickHandler = this._inputOfferClickHandler.bind(this);
    this._inputTimeStartChangeHandler = this._inputTimeStartChangeHandler.bind(this);
    this._inputTimeEndChangeHandler = this._inputTimeEndChangeHandler.bind(this);
    this._inputBasePriceChangeHandler = this._inputBasePriceChangeHandler.bind(this);
  }

  init() {
    this._creatingFormComponent.setGroupTypeChangeHandler(this._groupTypeChangeHandler);
    this._creatingFormComponent.setInputEventDestinationChangeHandler(this._inputEventDestinationChangeHandler);
    this._creatingFormComponent.setInputTimeStartChangeHandler(this._inputTimeStartChangeHandler);
    this._creatingFormComponent.setInputTimeEndChangeHandler(this._inputTimeEndChangeHandler);
    this._creatingFormComponent.setCalendarFormInput();
    this._creatingFormComponent.setInputBasePriceHandler(this._inputBasePriceChangeHandler);
    this._creatingFormComponent.setCreatingFormSubmitHandler(this._creatingFormSubmitHandler);

    this._buttonElement.disabled = true;
    this._mode = Mode.EDITING;
    document.addEventListener('keydown', this._escKeyDownHandler);
    render(this._container, this._creatingFormComponent, RenderPosition.AFTERBEGIN);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      completelyRemove(this._creatingFormComponent);
      this._buttonElement.disabled = false;
      document.removeEventListener('keydown', this._escKeyDownHandler);
      this._mode = Mode.DEFAULT;
    }
  }

  _groupTypeChangeHandler(evt) {
    const offers = checkOfferTypes(evt.target.value, this._offersPoint);
    getOfferTemplate(offers);

    const eventTypeIcon = this._creatingFormComponent.getElement().querySelector('.event__type-icon');
    eventTypeIcon.src = `img/icons/${evt.target.value}.png`;

    const typeOutput = this._creatingFormComponent.getElement().querySelector('.event__type-output');
    typeOutput.textContent = evt.target.value;

    this._createdPoint.offers = [];
    this._createdPoint.type = evt.target.value;
    this._creatingFormComponent.setInputOfferClickHandler(this._inputOfferClickHandler);
  }

  _inputOfferClickHandler(evt) {
    const selectedOfferIndex = this._createdPoint.offers.findIndex((item) => item.title === evt.target.dataset.title);
    if (evt.target.checked && selectedOfferIndex === -1) {
      this._createdPoint.offers.splice(0, 0, {title: evt.target.dataset.title, price: +evt.target.dataset.price});
    } else if (selectedOfferIndex !== -1) {
      this._createdPoint.offers.splice(selectedOfferIndex, 1);
    }
  }

  _inputTimeStartChangeHandler(evt) {
    this._createdPoint.dateFrom = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
  }

  _inputTimeEndChangeHandler(evt) {
    this._createdPoint.dateTo = dayjs(evt.target.value, 'YY/MM/DD HH:mm');
  }

  _inputBasePriceChangeHandler(evt) {
    this._createdPoint.basePrice = evt.target.value;
  }

  _inputEventDestinationChangeHandler(evt) {
    const destination = getSelectedDestinationData(evt.target.value, this._destinations);
    getDestinationTemplate(destination);
    this._createdPoint.destination = Object.assign({}, {name: evt.target.value}, destination);
  }

  _creatingFormSubmitHandler() {
    document.removeEventListener('keydown', this._escKeyDownHandler);
    completelyRemove(this._creatingFormComponent);
    this._buttonElement.disabled = false;
    this._mode = Mode.DEFAULT;
  }

  removeCreatingForm() {
    if (this._mode === Mode.EDITING) {
      completelyRemove(this._creatingFormComponent);
      this._buttonElement.disabled = false;
    }
  }
}
