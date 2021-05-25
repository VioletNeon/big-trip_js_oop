import TripPresenter from './presenter/trip.js';
import {generatePoint, destinations, offersPoint} from './mock/point.js';
import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
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

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

pointsModel.setDataItems(tripPoints);
offersModel.setDataItems(offersPoint);
destinationsModel.setDataItems(destinations);

render(tripNavigation, new SiteMenuView());

const tripPresenterArguments = {
  headerContainer: headerContainer,
  mainContainer: tripEventsContainer,
  destinationsModel: destinationsModel,
  offersModel: offersModel,
  pointsModel: pointsModel,
  filterModel: filterModel,
};

const tripPresenter = new TripPresenter(tripPresenterArguments);
const filterPresenter = new FilterPresenter(tripFilter, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();
