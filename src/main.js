import SiteMenu from './view/site-menu.js';
import Filter from './view/filter.js';
import TripInfo from './view/trip-info.js';
import Sort from './view/sort.js';
import EditingForm from './view/editing-form.js';
import Waypoint from './view/waypoint.js';
import CreatingForm from './view/creating-form.js';
import NoWaypointView from './view/no-waypoint.js';
import {generatePoint, offersPoint, destinations} from './mock/point.js';
import {checkOfferTypes} from './utils/common.js';
import {createElement, render, RenderPosition, replace} from './utils/render.js';
import {getOfferTemplate} from './view/get-offer-template';
import {getDestinationTemplate} from './view/get-destination-template';

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

render(tripNavigation, new SiteMenu());
render(tripFilter, new Filter());
render(tripEventsContainer, createElement(tripEventsListTemplate));

const tripEventsList = document.querySelector('.trip-events__list');

const renderWaypoint = (tripEventsList, point) => {
  const waypointComponent = new Waypoint(point);
  const waypointEditingFormComponent = new EditingForm(point, destinations, offersPoint);

  const replaceWaypointToEditingForm = () => {
    replace(waypointEditingFormComponent, waypointComponent);
  };

  const replaceEditingFormToWaypoint = () => {
    replace(waypointComponent, waypointEditingFormComponent);
  };

  const escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditingFormToWaypoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };

  waypointComponent.setRollupButtonClickHandler(() => {
    inputEventRemoveChangeHandler();
    replaceWaypointToEditingForm();
    document.addEventListener('keydown', escKeyDownHandler);
    waypointEditingFormComponent.setGroupTypeChangeHandler(groupTypeChangeHandler);
    waypointEditingFormComponent.setInputEventDestinationChangeHandler(inputEventDestinationChangeHandler);
    waypointEditingFormComponent.setCalendarFormInput();
  });

  waypointEditingFormComponent.setRollupButtonClickHandler(() => {
    replaceEditingFormToWaypoint();
    document.removeEventListener('keydown', escKeyDownHandler);
  });

  waypointEditingFormComponent.setEditingFormSubmitHandler(() => {
    replaceEditingFormToWaypoint();
    document.removeEventListener('keydown', escKeyDownHandler);
  });

  render(tripEventsList, waypointComponent);
};

const renderAllWaypoints = (points) => {
  points.forEach((point) => renderWaypoint(tripEventsList, point));
};

if (tripPoints.length === 0) {
  render(tripEventsContainer, new NoWaypointView());
} else {
  render(tripInfoBlock, new TripInfo(tripPoints), RenderPosition.AFTERBEGIN);
  render(tripEventsContainer, new Sort(), RenderPosition.AFTERBEGIN);
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

const inputEventRemoveChangeHandler = () => {
  const inputEventDestination = document.querySelector('.event__input--destination');
  const groupType = document.querySelector('.event__type-group');
  if (groupType) {
    groupType.removeEventListener('change', groupTypeChangeHandler);
  }
  if (inputEventDestination) {
    inputEventDestination.removeEventListener('change', inputEventDestinationChangeHandler);
  }
};

const newPointButtonClickHandler = () => {
  const escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      tripEventsList.removeChild(creatingFormComponent.getElement());
      newPointButton.disabled = false;
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };
  inputEventRemoveChangeHandler();
  document.addEventListener('keydown', escKeyDownHandler);
  creatingFormComponent.setInputEventDestinationChangeHandler(inputEventDestinationChangeHandler);
  creatingFormComponent.setGroupTypeChangeHandler(groupTypeChangeHandler);
  creatingFormComponent.setCreatingFormSubmitHandler(() => {
    document.removeEventListener('keydown', escKeyDownHandler);
    tripEventsList.removeChild(creatingFormComponent.getElement());
    newPointButton.disabled = false;
  });
  render(tripEventsList, creatingFormComponent, RenderPosition.AFTERBEGIN);
  creatingFormComponent.setCalendarFormInput();
  newPointButton.disabled = true;
};

newPointButton.addEventListener('click', newPointButtonClickHandler);
