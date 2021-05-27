import AbstractView from './abstract.js';

export default class Board extends AbstractView {
  getTemplate() {
    return `<section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>
          </section>`;
  }
}
