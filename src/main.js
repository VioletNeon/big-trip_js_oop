import {getMenuTemplate} from './view/menu.js';
import {getFiltersTemplate} from './view/filters.js';
import {getTripInfoTemplate} from './view/trip-info.js';
import {getSortingTemplate} from './view/sorting.js';
import {getEditingFormTemplate} from './view/editing-form.js';
import {getWaypointTemplate} from './view/waypoint.js';
import {getCreatingFormTemplate} from './view/creating-form.js';

const WAYPOINT_COUNT = 3;

const headerContainer = document.querySelector('.page-header__container');
const menuElement = headerContainer.querySelector('.trip-controls__navigation');
const filterElement = headerContainer.querySelector('.trip-controls__filters');
const tripInfoBlock = headerContainer.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');

const renderTemplate = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(menuElement, getMenuTemplate());

renderTemplate(filterElement, getFiltersTemplate());

renderTemplate(tripInfoBlock, getTripInfoTemplate(),'afterbegin');

renderTemplate(tripEventsContainer, getSortingTemplate(),'afterbegin');

renderTemplate(tripEventsContainer, getEditingFormTemplate());

for (let i = 0; i < WAYPOINT_COUNT; i++) {
  renderTemplate(tripEventsContainer, getWaypointTemplate());
}

renderTemplate(tripEventsContainer, getCreatingFormTemplate());


