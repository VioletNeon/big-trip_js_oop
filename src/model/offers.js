import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
    this.isLoading = true;
  }

  setDataItems(updateType, offers) {
    this._offers = [...offers];
    this.isLoading = false;
    this._notify(updateType);
  }

  getDataItems() {
    return this._offers;
  }

  removeObserver() {
    this._observers = [];
  }
}
