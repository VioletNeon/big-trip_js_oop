import SiteMenu from './view/site-menu.js';
import Filter from './view/filter.js';
import TripInfo from './view/trip-info.js';
import Sort from './view/sort.js';
import EditingForm from './view/editing-form.js';
import Waypoint from './view/waypoint.js';
import CreatingForm from './view/creating-form.js';
import NoWaypointView from './view/no-waypoint.js';
import {generatePoint, offersPoint, destinations} from './mock/point.js';
import {createElement, checkOfferTypes, renderElement, RenderPosition} from './view/utils.js';
import {getOfferTemplate} from './view/get-offer-template';
import {getDestinationTemplate} from './view/get-destination-template';
import {setCalendarFormInput} from './view/set-calendar-form-input';

const WAYPOINT_COUNT = 15;
const tripPoints = new Array(WAYPOINT_COUNT).fill(null).map(() => generatePoint());
const creatingFormComponent = new CreatingForm(offersPoint, destinations);

const headerContainer = document.querySelector('.page-header__container');
const tripNavigation = headerContainer.querySelector('.trip-controls__navigation');
const tripFilter = headerContainer.querySelector('.trip-controls__filters');
const tripInfoBlock = headerContainer.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const tripEventsListTemplate = '<ul class="trip-events__list"></ul>';
const newPointButton = document.querySelector('.trip-main__event-add-btn');

renderElement(tripNavigation, new SiteMenu().getElement());
renderElement(tripFilter, new Filter().getElement());
renderElement(tripEventsContainer, createElement(tripEventsListTemplate));

const tripEventsList = document.querySelector('.trip-events__list');

const renderWaypoint = (tripEventsList, point) => {
  const waypointComponent = new Waypoint(point);
  const waypointEditingFormComponent = new EditingForm(point, destinations, offersPoint);

  const replaceWaypointToEditingForm = () => {
    tripEventsList.replaceChild(waypointEditingFormComponent.getElement(), waypointComponent.getElement());
  };

  const replaceEditingFormToWaypoint = () => {
    tripEventsList.replaceChild(waypointComponent.getElement(), waypointEditingFormComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditingFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  waypointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceWaypointToEditingForm();
    document.addEventListener('keydown', onEscKeyDown);
    inputEventRemoveChangeHandler();
    inputEventChangeHandler();
    setCalendarFormInput();
  });

  waypointEditingFormComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', replaceEditingFormToWaypoint);

  waypointEditingFormComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceEditingFormToWaypoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  renderElement(tripEventsList, waypointComponent.getElement());
};

const renderAllWaypoints = (points) => {
  points.forEach((point) => renderWaypoint(tripEventsList, point));
};

if (tripPoints.length === 0) {
  renderElement(tripEventsContainer, new NoWaypointView().getElement(), RenderPosition.BEFOREEND);
} else {
  renderElement(tripInfoBlock, new TripInfo(tripPoints).getElement(), RenderPosition.AFTERBEGIN);
  renderElement(tripEventsContainer, new Sort().getElement(), RenderPosition.AFTERBEGIN);
  renderAllWaypoints(tripPoints);
}

const getSelectedDestinationData = (selectedDestinationName, destinations) => {
  for (const {name, description, pictures} of destinations) {
    if (selectedDestinationName === name) {
      return {description, pictures};
    }
  }
};

const groupTypeChangeHandler = (evt) => {
  const offers = checkOfferTypes(evt.target.value, offersPoint);
  getOfferTemplate(offers);
  const eventTypeIcon = document.querySelector('.event__type-icon');
  eventTypeIcon.src = `img/icons/${evt.target.value}.png`;
  const typeOutput = document.querySelector('.event__type-output');
  typeOutput.textContent = evt.target.value;
};

const inputEventDestinationChangeHandler = (evt) => {
  const destination = getSelectedDestinationData(evt.target.value, destinations);
  getDestinationTemplate(destination);
};

const inputEventChangeHandler = () => {
  const inputEventDestination = document.querySelector('.event__input--destination');
  const groupType = document.querySelector('.event__type-group');
  groupType.addEventListener('change', groupTypeChangeHandler);
  inputEventDestination.addEventListener('change', inputEventDestinationChangeHandler);
};

const inputEventRemoveChangeHandler = () => {
  const inputEventDestination = document.querySelector('.event__input--destination');
  const groupType = document.querySelector('.event__type-group');
  if (groupType) {groupType.removeEventListener('change', groupTypeChangeHandler);}
  if (inputEventDestination) {inputEventDestination.removeEventListener('change', inputEventDestinationChangeHandler);}
};

const newPointButtonClickHandler = () => {
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      tripEventsList.removeChild(creatingFormComponent.getElement());
      document.removeEventListener('keydown', onEscKeyDown);
      newPointButton.disabled = false;
    }
  };
  inputEventRemoveChangeHandler();

  document.addEventListener('keydown', onEscKeyDown);
  creatingFormComponent.getElement().querySelector('.event__input--destination').addEventListener('change', inputEventDestinationChangeHandler);
  creatingFormComponent.getElement().querySelector('.event__type-group').addEventListener('change', groupTypeChangeHandler);
  creatingFormComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    document.removeEventListener('keydown', onEscKeyDown);
    tripEventsList.removeChild(creatingFormComponent.getElement());
    newPointButton.disabled = false;
  });
  renderElement(tripEventsList, creatingFormComponent.getElement(), RenderPosition.AFTERBEGIN);
  setCalendarFormInput();
  newPointButton.disabled = true;
};

newPointButton.addEventListener('click', newPointButtonClickHandler);
