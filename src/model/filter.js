import Observer from '../utils/observer.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = 'everything';
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
