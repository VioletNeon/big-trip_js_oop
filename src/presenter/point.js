import EditingFormView from '../view/editing-form.js';
import WaypointView from '../view/waypoint.js';
import {getSelectedDestinationData, render, replace, completelyRemove} from '../utils/render.js';
import {checkOfferTypes} from '../utils/common';
import {getOfferTemplate} from '../view/get-offer-template';
import {getDestinationTemplate} from '../view/get-destination-template';
import {Mode} from '../utils/const.js';

export default class Point {
  constructor(container, destinations, offersPoint, changeData, changeMode, removeCreatingForm) {
    this._container = container;
    this._destinations = destinations;
    this._offersPoint = offersPoint;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._removeCreatingForm = removeCreatingForm;

    this._waypointComponent = null;
    this._editingFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._rollUpButtonClickHandler = this._rollUpButtonClickHandler.bind(this);
    this._rollDownButtonClickHandler = this._rollDownButtonClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._groupTypeChangeHandler = this._groupTypeChangeHandler.bind(this);
    this._inputEventDestinationChangeHandler = this._inputEventDestinationChangeHandler.bind(this);
    this._editingFormSubmitHandler = this._editingFormSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const previousWaypointComponent = this._waypointComponent;
    const previousEditingFormComponent = this._editingFormComponent;

    this._waypointComponent = new WaypointView(this._point);
    this._editingFormComponent = new EditingFormView(this._point, this._destinations, this._offersPoint);

    this._waypointComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._waypointComponent.setRollUpButtonClickHandler(this._rollUpButtonClickHandler);
    this._editingFormComponent.setInputEventDestinationChangeHandler(this._inputEventDestinationChangeHandler);
    this._editingFormComponent.setCalendarFormInput();
    this._editingFormComponent.setRollDownButtonClickHandler(this._rollDownButtonClickHandler);
    this._editingFormComponent.setEditingFormSubmitHandler(this._editingFormSubmitHandler);

    if (previousWaypointComponent === null || previousEditingFormComponent === null) {
      render(this._container, this._waypointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, previousWaypointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editingFormComponent, previousEditingFormComponent);
    }

    completelyRemove(previousWaypointComponent);
    completelyRemove(previousEditingFormComponent);
  }

  destroy() {
    completelyRemove(this._waypointComponent);
    completelyRemove(this._editingFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditingFormToWaypoint();
    }
  }

  _favoriteClickHandler() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _replaceWaypointToEditingForm() {
    replace(this._editingFormComponent, this._waypointComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditingFormToWaypoint() {
    replace(this._waypointComponent, this._editingFormComponent);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditingFormToWaypoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _rollUpButtonClickHandler() {
    this._replaceWaypointToEditingForm();
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._editingFormComponent.setGroupTypeChangeHandler(this._groupTypeChangeHandler);
    this._removeCreatingForm();
  }

  _rollDownButtonClickHandler() {
    this._replaceEditingFormToWaypoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _groupTypeChangeHandler(evt) {
    const offers = checkOfferTypes(evt.target.value, this._offersPoint);
    getOfferTemplate(offers);

    const eventTypeIcon = this._editingFormComponent.getElement().querySelector('.event__type-icon');
    eventTypeIcon.src = `img/icons/${evt.target.value}.png`;

    const typeOutput = this._editingFormComponent.getElement().querySelector('.event__type-output');
    typeOutput.textContent = evt.target.value;
  }

  _inputEventDestinationChangeHandler(evt) {
    const destination = getSelectedDestinationData(evt.target.value, this._destinations);
    getDestinationTemplate(destination);
  }

  _editingFormSubmitHandler(point) {
    this._changeData(point);
    this._replaceEditingFormToWaypoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }
}
