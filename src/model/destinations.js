import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDataItems(destinations) {
    this._destinations = [...destinations];
  }

  getDataItems() {
    return this._destinations;
  }
}
