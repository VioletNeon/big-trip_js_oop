import WaypointList from '../view/waypoint-list.js';
import SortView from '../view/sort.js';
import TripInfoView from '../view/trip-info.js';
import NoWaypointView from '../view/no-waypoint.js';
import NewPointPresenter from '../presenter/new-point.js';
import {render, RenderPosition, completelyRemove} from '../utils/render.js';
import PointPresenter from '../presenter/point.js';
import {SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import {sortWaypointTime, sortWaypointPrice, sortWaypointDay} from '../utils/sorting.js';

export default class Trip {
  constructor(tripPresenterArguments) {
    const {headerContainer, mainContainer, destinationsModel, offersModel, pointsModel, filterModel} = tripPresenterArguments;
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._waypointListComponent = new WaypointList();
    this._sortComponent = null;
    this._noWaypointComponent = new NoWaypointView();
    this._newPointButton = this._headerContainer.querySelector('.trip-main__event-add-btn');
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._newPointButtonClickHandler = this._newPointButtonClickHandler.bind(this);
    this._removeCreatingFormHandler = this._removeCreatingFormHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);

    this._pointsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);

    const newPointArguments = {
      container: this._waypointListComponent,
      buttonElement: this._newPointButton,
      destinations: this._destinationsModel,
      offersPoint: this._offersModel,
      changeData: this._viewActionHandler,
    };

    this._newPoint = new NewPointPresenter(newPointArguments);
  }

  init() {
    this._renderWaypointList();
    this._setNewPointButtonClickHandler();
    this._renderTrip();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getDataItems();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.slice().sort(sortWaypointDay);
      case SortType.TIME:
        return filteredPoints.slice().sort(sortWaypointTime);
      case SortType.PRICE:
        return filteredPoints.slice().sort(sortWaypointPrice);
    }
  }

  _modeChangeHandler() {
    this._newPoint.removeCreatingForm();
    Object
      .values(this._pointPresenter)
      .forEach((waypointPresenter) => waypointPresenter.resetView());
  }

  _clearTrip({resetSortType = false} = {}) {
    this._newPoint.removeCreatingForm();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    completelyRemove(this._sortComponent);
    completelyRemove(this._noWaypointComponent);
    completelyRemove(this._tripInfoComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _viewActionHandler(actionType, updateType, updating) {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this._pointsModel.updatePoint(updateType, updating);
        break;
      case UserAction.ADD_WAYPOINT:
        this._pointsModel.addPoint(updateType, updating);
        break;
      case UserAction.DELETE_WAYPOINT:
        this._pointsModel.deletePoint(updateType, updating);
        break;
    }
  }

  _modelEventHandler(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _renderWaypointList() {
    render(this._mainContainer, this._waypointListComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setTypeChangeHandler(this._sortTypeChangeHandler);
    render(this._mainContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo(points) {
    if (points.length === 0) {
      return;
    }

    this._tripInfoComponent = new TripInfoView(points);
    const tripInfoBlock = this._headerContainer.querySelector('.trip-main');
    render(tripInfoBlock, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderWaypoint(point) {
    const waypointsArguments = {
      container: this._waypointListComponent,
      destinations: this._destinationsModel,
      offersPoint: this._offersModel,
      changeData: this._viewActionHandler,
      changeMode: this._modeChangeHandler,
      removeCreatingForm: this._removeCreatingFormHandler,
    };
    const waypointPresenter = new PointPresenter(waypointsArguments);
    waypointPresenter.init(point);
    this._pointPresenter[point.id] = waypointPresenter;
  }

  _renderAllWaypoints(points) {
    points.forEach((point) => this._renderWaypoint(point));
  }

  _renderNoWaypoints() {
    render(this._mainContainer, this._noWaypointComponent);
  }

  _removeCreatingFormHandler() {
    this._newPoint.removeCreatingForm();
  }

  _newPointButtonClickHandler(evt) {
    evt.preventDefault();
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPoint.init();
    completelyRemove(this._noWaypointComponent);
  }

  _setNewPointButtonClickHandler() {
    this._newPointButton.addEventListener('click', this._newPointButtonClickHandler);
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderTrip() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoWaypoints();
      return;
    }

    this._renderSort();
    this._renderAllWaypoints(points.slice());
    this._renderTripInfo(points);
  }
}
