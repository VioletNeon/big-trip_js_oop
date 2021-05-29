import Observer from '../utils/observer.js';
import dayjs from 'dayjs';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setDataItems(updateType, points) {
    this._points = [...points];
    this._notify(updateType);
  }

  getDataItems() {
    return this._points;
  }

  updatePoint(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      updatedPoint,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this._points = [
      newPoint,
      ...this._points,
    ];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this._points.findIndex((point) => point.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(dataItem) {
    const adaptedItem = Object.assign(
      {},
      dataItem,
      {
        basePrice: dataItem.base_price,
        dateFrom: dataItem.date_from !== null ? dayjs(new Date(dataItem.date_from)) : dayjs(dataItem.date_from),
        dateTo: dataItem.date_to !== null ? dayjs(new Date(dataItem.date_to)) : dayjs(dataItem.date_to),
        isFavorite: dataItem.is_favorite,
      },
    );

    delete adaptedItem.base_price;
    delete adaptedItem.date_from;
    delete adaptedItem.date_to;
    delete adaptedItem.is_favorite;
    return adaptedItem;
  }

  static adaptToServer(dataItem) {
    const adaptedItem = Object.assign(
      {},
      dataItem,
      {
        'base_price': dataItem.basePrice,
        'date_from': dataItem.dateFrom.toISOString(),
        'date_to': dataItem.dateTo.toISOString(),
        'is_favorite': dataItem.isFavorite,
      },
    );

    delete adaptedItem.basePrice;
    delete adaptedItem.dateFrom;
    delete adaptedItem.dateTo;
    delete adaptedItem.isFavorite;

    return adaptedItem;
  }
}
