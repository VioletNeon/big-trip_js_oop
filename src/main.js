import TripPresenter from './presenter/trip.js';
import {generatePoint, destinations, offersPoint} from './mock/point.js';
import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import SiteMenuView from './view/site-menu.js';
import StatsView from './view/stats.js';
import {render, completelyRemove} from './utils/render.js';
import {MenuItem} from './utils/const.js';

const WAYPOINT_COUNT = 15;
const tripPoints = new Array(WAYPOINT_COUNT).fill(null).map(() => generatePoint());

let currentMenuItem = MenuItem.TABLE;

const mainEventsContainer = document.querySelector('main .page-body__container');
const headerContainer = document.querySelector('.page-header__container');
const tripNavigation = headerContainer.querySelector('.trip-controls__navigation');
const tripFilter = headerContainer.querySelector('.trip-controls__filters');
const siteMenuComponent = new SiteMenuView();

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

pointsModel.setDataItems(tripPoints);
offersModel.setDataItems(offersPoint);
destinationsModel.setDataItems(destinations);

render(tripNavigation, siteMenuComponent);

let statsComponent = null;

const tripPresenterArguments = {
  headerContainer: headerContainer,
  mainContainer: mainEventsContainer,
  destinationsModel: destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
};

const tripPresenter = new TripPresenter(tripPresenterArguments);
const filterPresenter = new FilterPresenter(tripFilter, filterModel, pointsModel);

const siteMenuClickHandler = (menuItem) => {
  if (currentMenuItem === menuItem) {
    return;
  }
  currentMenuItem = menuItem;

  switch (menuItem) {
    case MenuItem.TABLE:
      completelyRemove(statsComponent);
      statsComponent = null;
      tripPresenter.init();
      siteMenuComponent.setMenuItem(menuItem);
      break;
    case MenuItem.STATS:
      statsComponent = new StatsView();
      tripPresenter.destroy();
      render(mainEventsContainer, statsComponent);
      statsComponent.setCharts(pointsModel.getDataItems());
      siteMenuComponent.setMenuItem(menuItem);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(siteMenuClickHandler);

filterPresenter.init();
tripPresenter.init();
