import WaypointList from '../view/waypoint-list.js';
import SortView from '../view/sort.js';
import TripInfoView from '../view/trip-info.js';
import NoWaypointView from '../view/no-waypoint.js';
import NewPointPresenter from '../presenter/new-point.js';
import BoardView from '../view/board.js';
import LoadingView from '../view/loading.js';
import {render, RenderPosition, completelyRemove} from '../utils/render.js';
import PointPresenter from '../presenter/point.js';
import {SortType, UpdateType, UserAction, FilterType, State} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import {sortWaypointTime, sortWaypointPrice, sortWaypointDay} from '../utils/sorting.js';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast';

export default class Trip {
  constructor(tripPresenterArguments) {
    const {headerContainer,
      mainContainer,
      destinationsModel,
      offersModel,
      pointsModel,
      filterModel,
      apiWithProvider} = tripPresenterArguments;
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._api = apiWithProvider;
    this._isLoading = true;
    this._waypointListComponent = new WaypointList();
    this._boardComponent = new BoardView();
    this._tripInfoComponent = null;
    this._sortComponent = null;
    this._noWaypointComponent = new NoWaypointView();
    this._loadingComponent = new LoadingView();
    this._newPointButton = this._headerContainer.querySelector('.trip-main__event-add-btn');
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._newPointButtonClickHandler = this._newPointButtonClickHandler.bind(this);
    this._removeCreatingFormHandler = this._removeCreatingFormHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);

    const newPointArguments = {
      container: this._waypointListComponent,
      buttonElement: this._newPointButton,
      destinationsModel: this._destinationsModel,
      offersPointModel: this._offersModel,
      changeData: this._viewActionHandler,
    };

    this._newPointPresenter = new NewPointPresenter(newPointArguments);
    this._setNewPointButtonClickHandler();
  }

  init() {
    render(this._mainContainer, this._boardComponent, RenderPosition.AFTERBEGIN);
    this._renderWaypointList();
    this._renderTrip();
    this._newPointButton.disabled = false;

    this._pointsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  destroy() {
    this._clearTrip({resetSortType: true});
    const points = this._getPoints();
    this._renderTripInfo(points);
    completelyRemove(this._waypointListComponent);
    completelyRemove(this._boardComponent);
    this._newPointButton.disabled = true;

    this._pointsModel.removeObserver(this._modelEventHandler);
    this._filterModel.removeObserver(this._modelEventHandler);
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

  _clearTrip({resetSortType = false} = {}) {
    this._newPointPresenter.removeCreatingForm();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    completelyRemove(this._sortComponent);
    completelyRemove(this._loadingComponent);
    completelyRemove(this._noWaypointComponent);
    completelyRemove(this._tripInfoComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderWaypointList() {
    render(this._boardComponent, this._waypointListComponent);
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo(points) {
    if (!points.length) {
      return;
    }

    if (this._tripInfoComponent !== null) {
      completelyRemove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(points);
    const tripInfoBlock = this._headerContainer.querySelector('.trip-main');
    render(tripInfoBlock, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderWaypoint(point) {
    const waypointsArguments = {
      container: this._waypointListComponent,
      destinationsModel: this._destinationsModel,
      offersPointModel: this._offersModel,
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
    render(this._boardComponent, this._noWaypointComponent);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (!points.length) {
      this._renderNoWaypoints();
      return;
    }

    this._renderSort();
    this._renderAllWaypoints(points.slice());
    this._renderTripInfo(points);
  }

  _setNewPointButtonClickHandler() {
    this._newPointButton.addEventListener('click', this._newPointButtonClickHandler);
  }

  _modeChangeHandler() {
    this._newPointPresenter.removeCreatingForm();
    Object
      .values(this._pointPresenter)
      .forEach((waypointPresenter) => waypointPresenter.resetView());
  }

  _viewActionHandler(actionType, updateType, updating) {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this._pointPresenter[updating.id].setViewState(State.SAVING);
        this._api.updatePoint(updating).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        }).catch(() => {
          this._pointPresenter[updating.id].setViewState(State.ABORTING);
        });
        break;
      case UserAction.ADD_WAYPOINT:
        this._newPointPresenter.setViewState(State.SAVING);
        this._api.addPoint(updating).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        }).catch(() => {
          this._newPointPresenter.setViewState(State.ABORTING);
        });
        break;
      case UserAction.DELETE_WAYPOINT:
        this._pointPresenter[updating.id].setViewState(State.DELETING);
        this._api.deletePoint(updating).then(() => {
          this._pointsModel.deletePoint(updateType, updating);
        }).catch(() => {
          this._pointPresenter[updating.id].setViewState(State.ABORTING);
        });
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
      case UpdateType.INIT:
        this._isLoading = false;
        completelyRemove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _removeCreatingFormHandler() {
    this._newPointPresenter.removeCreatingForm();
  }

  _newPointButtonClickHandler(evt) {
    if (!isOnline()) {
      toast('You can\'t create point offline');
      return;
    }
    evt.preventDefault();
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init();
    completelyRemove(this._noWaypointComponent);
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
