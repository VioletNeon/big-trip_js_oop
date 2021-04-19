import {getMenuTemplate} from './view/menu.js';
import {getFiltersTemplate} from './view/filters.js';
import {getTripInfoTemplate} from './view/trip-info.js';
import {getSortingTemplate} from './view/sorting.js';
import {getEditingFormTemplate, getPictureTemplate} from './view/editing-form.js';
import {getWaypointTemplate} from './view/waypoint.js';
import {getCreatingFormTemplate} from './view/creating-form.js';
import {generatePoint, offersPoint, destinations} from './mock/point.js';
import {checkOfferTypes} from './mock/utils.js';
import flatpickr from 'flatpickr';

const WAYPOINT_COUNT = 15;
const tripPoints = new Array(WAYPOINT_COUNT).fill(null).map(() => {return generatePoint();});

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

const renderAllWayPoints = () => {
  for (let i = 0; i < WAYPOINT_COUNT; i++) {
    renderTemplate(tripEventsList, getWaypointTemplate(tripPoints[i]));
  }
};

renderAllWayPoints();

renderTemplate(tripEventsList, getEditingFormTemplate(tripPoints[0], destinations, offersPoint), 'afterbegin');

const setCalendarFormInput = () => {
  const eventTimeInput = document.querySelectorAll('.event__input--time');
  if (eventTimeInput.length > 0) {
    eventTimeInput.forEach((item) => {
      flatpickr(item, {
        enableTime: true,
        dateFormat: 'y/m/d H:i',
      });
    });
  }
};

setCalendarFormInput();

const getOfferTemplate = (typeOffers) => {
  const availableOffers = document.querySelector('.event__available-offers');
  const sectionOffers = document.querySelector('.event__section--offers');
  sectionOffers.classList.remove('visually-hidden');
  availableOffers.innerHTML = '';
  if (typeOffers.length > 0) {
    const templates = typeOffers.map(({title, price}) => {
      const offerTitle = [title].join('-');
      return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-1" type="checkbox" name="event-offer-${offerTitle}">
        <label class="event__offer-label" for="event-offer-${offerTitle}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
    });
    availableOffers.innerHTML = `${templates.join(' ')}`;
  } else {
    sectionOffers.classList.add('visually-hidden');
  }
};

const getDestinationTemplate = (destination) => {
  const sectionDestination = document.querySelector('.event__section--destination');
  sectionDestination.classList.remove('visually-hidden');
  sectionDestination.innerHTML = '';
  const {description, pictures} = destination;
  const destinationPictures = getPictureTemplate(pictures);
  if (description.length > 0 || destinationPictures.length > 0) {
    const template = `
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description ${description ? '' : 'visually-hidden'}">${description.join(' ')}</p>

      <div class="event__photos-container ${destinationPictures ? '' : 'visually-hidden'}">
        <div class="event__photos-tape">
          ${destinationPictures}
        </div>
      </div>`;
    sectionDestination.innerHTML = `${template}`;
  } else {
    sectionDestination.classList.add('visually-hidden');
  }
};

const inputEventDestination = document.querySelector('.event__input--destination');
const typeGroup = document.querySelector('.event__type-group');

const checkDestinationNameTypes = (optionName, destination) => {
  for (const {name, description, pictures} of destination) {
    if (name === optionName) {
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
  const destination = checkDestinationNameTypes(evt.target.value, destinations);
  getDestinationTemplate(destination);
};

typeGroup.addEventListener('change', callbackChangeOfferTemplate);
inputEventDestination.addEventListener('change', callbackChangeDestinationTemplate);

const callbackClickNewPointButton = () => {
  typeGroup ? typeGroup.removeEventListener('change', callbackChangeOfferTemplate) : '';
  inputEventDestination ? inputEventDestination.removeEventListener('change', callbackChangeDestinationTemplate) : '';
  tripEventsList.innerHTML = '';
  renderAllWayPoints();
  renderTemplate(tripSort, getCreatingFormTemplate(offersPoint, destinations), 'afterend');
  const inputDestination = document.querySelector('.event__input--destination');
  const eventTypeGroup = document.querySelector('.event__type-group');
  eventTypeGroup.addEventListener('change', callbackChangeOfferTemplate);
  inputDestination.addEventListener('change', callbackChangeDestinationTemplate);
  setCalendarFormInput();
  newPointButton.disabled = 'disabled';
};

newPointButton.addEventListener('click', callbackClickNewPointButton);
