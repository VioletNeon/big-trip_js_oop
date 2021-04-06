import {createMenuTemplate} from './view/menu.js';
import {createFilters} from './view/filters.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createSortingTemplate} from './view/sorting.js';
import {createEditingFormTemplate} from './view/editing-form.js';
import {createWaypointTemplate} from './view/waypoint.js';
import {createCreatingFormTemplate} from './view/creating-form.js';

const WAYPOINT_COUNT = 3;

const headerContainer = document.querySelector('.page-header__container');
const menuElement = headerContainer.querySelector('.trip-controls__navigation');
const filterElement = headerContainer.querySelector('.trip-controls__filters');
const tripInfoBlock = headerContainer.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(menuElement, createMenuTemplate(),'beforeend');

renderTemplate(filterElement, createFilters(),'beforeend');

renderTemplate(tripInfoBlock, createTripInfoTemplate(),'afterbegin');

renderTemplate(tripEventsContainer, createSortingTemplate(),'afterbegin');

renderTemplate(tripEventsContainer, createEditingFormTemplate(),'beforeend');

for (let i = 0; i < WAYPOINT_COUNT; i++) {
  renderTemplate(tripEventsContainer, createWaypointTemplate(),'beforeend');
}

renderTemplate(tripEventsContainer, createCreatingFormTemplate(),'beforeend');


