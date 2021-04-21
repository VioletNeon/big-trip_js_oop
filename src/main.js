import {getMenuTemplate} from './view/menu.js';
import {getFiltersTemplate} from './view/filters.js';
import {getTripInfoTemplate} from './view/trip-info.js';
import {getSortingTemplate} from './view/sorting.js';
import {getEditingFormTemplate} from './view/editing-form.js';
import {getWaypointTemplate} from './view/waypoint.js';
import {getCreatingFormTemplate} from './view/creating-form.js';
import {generatePoint, offersPoint, destinations} from './mock/point.js';
import {checkOfferTypes} from './view/utils.js';
import {getOfferTemplate} from './view/get-offer-template';
import {getDestinationTemplate} from './view/get-destination-template';
import {setCalendarFormInput} from './view/set-calendar-form-input';

const WAYPOINT_COUNT = 15;
const tripPoints = new Array(WAYPOINT_COUNT).fill(null).map(() => generatePoint());
const firstEditedPoint = tripPoints[0];

const headerContainer = document.querySelector('.page-header__container');
const tripNavigation = headerContainer.querySelector('.trip-controls__navigation');
const tripFilter = headerContainer.querySelector('.trip-controls__filters');
const tripInfoBlock = headerContainer.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const tripEventsListTemplate = '<ul class="trip-events__list"></ul>';
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const renderTemplate = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(tripNavigation, getMenuTemplate());
renderTemplate(tripFilter, getFiltersTemplate());
renderTemplate(tripInfoBlock, getTripInfoTemplate(tripPoints),'afterbegin');
renderTemplate(tripEventsContainer, getSortingTemplate(),'afterbegin');
renderTemplate(tripEventsContainer, tripEventsListTemplate);

const tripEventsList = document.querySelector('.trip-events__list');
const tripSort = document.querySelector('.trip-sort');

const renderAllWaypoints = (points) => {
  points.forEach((point) => renderTemplate(tripEventsList, getWaypointTemplate(point)));
};

renderAllWaypoints(tripPoints);
renderTemplate(tripEventsList, getEditingFormTemplate(firstEditedPoint, destinations, offersPoint), 'afterbegin');

setCalendarFormInput();

const inputEventDestination = document.querySelector('.event__input--destination');
const groupType = document.querySelector('.event__type-group');

const getSelectedDestinationDate = (selectedDestinationName, destinations) => {
  for (const {name, description, pictures} of destinations) {
    if (selectedDestinationName === name) {
      return {description, pictures};
    }
  }
};

const callbackChangeOfferTemplate = (evt) => {
  const offers = checkOfferTypes(evt.target.value, offersPoint);
  getOfferTemplate(offers);
  const eventTypeIcon = document.querySelector('.event__type-icon');
  eventTypeIcon.src = `img/icons/${evt.target.value}.png`;
  const typeOutput = document.querySelector('.event__type-output');
  typeOutput.textContent = evt.target.value;
};

const callbackChangeDestinationTemplate = (evt) => {
  const destination = getSelectedDestinationDate(evt.target.value, destinations);
  getDestinationTemplate(destination);
};

groupType.addEventListener('change', callbackChangeOfferTemplate);
inputEventDestination.addEventListener('change', callbackChangeDestinationTemplate);

const newPointButtonClickHandler = () => {
  if (groupType) {groupType.removeEventListener('change', callbackChangeOfferTemplate);}
  if (inputEventDestination) {inputEventDestination.removeEventListener('change', callbackChangeDestinationTemplate);}
  tripEventsList.innerHTML = '';
  renderAllWaypoints(tripPoints);
  renderTemplate(tripSort, getCreatingFormTemplate(offersPoint, destinations), 'afterend');
  const inputDestination = document.querySelector('.event__input--destination');
  const creatingFormGroutType = document.querySelector('.event__type-group');
  creatingFormGroutType.addEventListener('change', callbackChangeOfferTemplate);
  inputDestination.addEventListener('change', callbackChangeDestinationTemplate);
  setCalendarFormInput();
  newPointButton.disabled = 'disabled';
};

newPointButton.addEventListener('click', newPointButtonClickHandler);
