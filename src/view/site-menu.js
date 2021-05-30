import AbstractView from './abstract.js';
import {MenuItem} from '../utils/const.js';

const BUTTON_CLASS_ACTIVE = 'trip-tabs__btn--active';

export default class SiteMenu extends AbstractView {
  constructor() {
    super();
    this._tabs = null;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>`;
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    if (this._tabs === null) {
      this._tabs = this.getElement().querySelectorAll('.trip-tabs__btn');
    }

    this._tabs.forEach((tab) => {
      tab.dataset.menuItem === menuItem ? tab.classList.add(BUTTON_CLASS_ACTIVE) : tab.classList.remove(BUTTON_CLASS_ACTIVE);
    });
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
