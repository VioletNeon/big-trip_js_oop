import TripPresenter from './presenter/trip.js';
import {generatePoint, destinations, offersPoint} from './mock/point.js';

const WAYPOINT_COUNT = 15;
const tripPoints = new Array(WAYPOINT_COUNT).fill(null).map(() => generatePoint());

const headerContainer = document.querySelector('.page-header__container');
const tripEventsContainer = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter(headerContainer, tripEventsContainer, destinations, offersPoint);

tripPresenter.init(tripPoints);
