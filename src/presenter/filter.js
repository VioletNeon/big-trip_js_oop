import FilterView from '../view/filter.js';
import {render, replace, completelyRemove} from '../utils/render.js';
import {FilterType, UpdateType} from '../utils/const.js';
import {filter} from '../utils/filter.js';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._pointsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      this._setDisabled();
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    completelyRemove(prevFilterComponent);
    this._setDisabled();
  }

  _setDisabled() {
    const filterButtons = this._filterComponent.getElement().querySelectorAll('input');
    const points = this._pointsModel.getDataItems().slice();
    filterButtons.forEach((filterButton) => {
      if (filter[filterButton.value](points).length === 0) {
        filterButton.disabled = true;
      }
    });
  }

  _modelEventHandler() {
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
      },
      {
        type: FilterType.PAST,
        name: 'Past',
      },
    ];
  }
}