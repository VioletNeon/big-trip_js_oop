import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setDataItems(offers) {
    this._offers = [...offers];
  }

  getDataItems() {
    return this._offers;
  }
}
