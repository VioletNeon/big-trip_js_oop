import WaypointList from '../view/waypoint-list.js';
import SortView from '../view/sort.js';
import SiteMenuView from '../view/site-menu.js';
import FilterView from '../view/filter.js';
import TripInfoView from '../view/trip-info.js';
import NoWaypointView from '../view/no-waypoint.js';
import NewPointPresenter from '../presenter/new-point.js';
import {render, RenderPosition, completelyRemove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import PointPresenter from '../presenter/point.js';
import {SortType} from '../utils/const.js';
import {sortWaypointTime, sortWaypointPrice, sortWaypointDay} from '../utils/sorting.js';

export default class Trip {
  constructor(headerContainer, mainContainer, destinations, offersPoint) {
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._destinations = destinations;
    this._offersPoint = offersPoint;
    this._waypointListComponent = new WaypointList();
    this._sortComponent = new SortView();
    this._noWaypointComponent = new NoWaypointView();
    this._siteMenuComponent = new SiteMenuView();
    this._filterComponent = new FilterView();
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._waypointChangeHandler = this._waypointChangeHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._newPointButtonClickHandler = this._newPointButtonClickHandler.bind(this);
    this._removeCreatingFormHandler = this._removeCreatingFormHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  init(waypoints) {
    this._newPointButton = this._headerContainer.querySelector('.trip-main__event-add-btn');
    this._newPoint = new NewPointPresenter(this._waypointListComponent, this._newPointButton, this._destinations, this._offersPoint, this._waypointChangeHandler);
    this._waypoints = waypoints.slice();
    this._sourcedTripWaypoints = waypoints.slice();
    this._renderSiteMenu();
    this._renderFilter();
    this._renderWaypointList();
    this._setNewPointButtonClickHandler();
    this._renderBoard();
  }

  _modeChangeHandler() {
    Object
      .values(this._pointPresenter)
      .forEach((waypointPresenter) => waypointPresenter.resetView());
  }

  _clearTripList() {
    Object
      .values(this._pointPresenter)
      .forEach((waypointPresenter) => waypointPresenter.destroy());
    this._pointPresenter = {};
  }

  _waypointChangeHandler(updatedWaypoint) {
    this._waypoints = updateItem(this._waypoints, updatedWaypoint);
    this._sourcedTripWaypoints = updateItem(this._sourcedTripWaypoints, updatedWaypoint);
    this._pointPresenter[updatedWaypoint.id].init(updatedWaypoint);
  }

  _renderWaypointList() {
    render(this._mainContainer, this._waypointListComponent);
  }

  _renderSort() {
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    render(this._mainContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSiteMenu() {
    const tripNavigation = this._headerContainer.querySelector('.trip-controls__navigation');
    render(tripNavigation, this._siteMenuComponent);
  }

  _renderFilter() {
    const tripFilter = this._headerContainer.querySelector('.trip-controls__filters');
    render(tripFilter, this._filterComponent);
  }

  _renderTripInfo() {
    if (this._waypoints.length === 0) {
      return;
    }

    const tripInfoComponent = new TripInfoView(this._waypoints);
    const tripInfoBlock = this._headerContainer.querySelector('.trip-main');
    render(tripInfoBlock, tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderWaypoint(point) {
    const waypointPresenter = new PointPresenter(this._waypointListComponent, this._destinations, this._offersPoint, this._waypointChangeHandler, this._modeChangeHandler, this._removeCreatingFormHandler);
    waypointPresenter.init(point);
    this._pointPresenter[point.id] = waypointPresenter;
  }

  _renderAllWaypoints() {
    this._waypoints.forEach((point) => this._renderWaypoint(point));
  }

  _renderNoWaypoints() {
    render(this._mainContainer, this._noWaypointComponent);
  }

  _removeCreatingFormHandler() {
    this._newPoint.removeCreatingForm();
  }

  _newPointButtonClickHandler() {
    this._newPoint.init();
    this._modeChangeHandler();
    this._sortTypeChangeHandler(SortType.DAY);
    this._sortComponent.setDefaultTripSortInput();
    completelyRemove(this._noWaypointComponent);
  }

  _setNewPointButtonClickHandler() {
    this._newPointButton.addEventListener('click', this._newPointButtonClickHandler);
  }

  _sortWaypoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._waypoints.sort(sortWaypointDay);
        break;
      case SortType.TIME:
        this._waypoints.sort(sortWaypointTime);
        break;
      case SortType.PRICE:
        this._waypoints.sort(sortWaypointPrice);
        break;
      default:
        this._waypoints = this._sourcedTripWaypoints.slice();
    }

    this._currentSortType = sortType;
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortWaypoints(sortType);
    this._clearTripList();
    this._renderAllWaypoints();
  }

  _renderBoard() {
    if (this._waypoints.length === 0) {
      this._renderNoWaypoints();
      return;
    }

    this._renderSort();
    this._renderAllWaypoints();
    this._renderTripInfo();
  }
}
