import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
    this.isLoading = true;
  }

  setDataItems(updateType, destinations) {
    this._destinations = [...destinations];
    this.isLoading = false;
    this._notify(updateType);
  }

  getDataItems() {
    return this._destinations;
  }

  removeObserver() {
    this._observers = [];
  }
}
