import TripPresenter from './presenter/trip.js';
import {generatePoint, destinations, offersPoint} from './mock/point.js';
import Points from './model/points.js';
import Offers from './model/offers.js';
import Destinations from './model/destinations.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import SiteMenuView from './view/site-menu.js';
import {render} from './utils/render.js';

const WAYPOINT_COUNT = 15;
const tripPoints = new Array(WAYPOINT_COUNT).fill(null).map(() => generatePoint());

const headerContainer = document.querySelector('.page-header__container');
const tripEventsContainer = document.querySelector('.trip-events');
const tripNavigation = headerContainer.querySelector('.trip-controls__navigation');
const tripFilter = headerContainer.querySelector('.trip-controls__filters');

const pointsModel = new Points();
const offersModel = new Offers();
const destinationsModel = new Destinations();
const filterModel = new FilterModel();

pointsModel.setPoints(tripPoints);
offersModel.setOffers(offersPoint);
destinationsModel.setDestinations(destinations);

render(tripNavigation, new SiteMenuView());

const tripPresenter = new TripPresenter(headerContainer, tripEventsContainer, destinationsModel, offersModel, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripFilter, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();
