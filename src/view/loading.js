import AbstractView from './abstract.js';

export default class Loading extends AbstractView {
  getTemplate() {
    return `<p class="trip-events__msg">
      Loading...
    </p>`;
  }
}
