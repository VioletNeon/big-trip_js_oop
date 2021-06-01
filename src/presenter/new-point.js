import CreatingFormView from '../view/creating-form.js';
import {render, RenderPosition, completelyRemove} from '../utils/render.js';

export default class NewPoint {
  constructor(newPointArguments) {
    const {container, buttonElement, destinationsModel, offersPointModel, changeData} = newPointArguments;
    this._container = container;
    this._destinationsModel = destinationsModel;
    this._offersPointModel = offersPointModel;
    this._buttonElement = buttonElement;
    this._changeData = changeData;
    this._creatingFormComponent = null;

    this._creatingFormEscKeyDownHandler = this._creatingFormEscKeyDownHandler.bind(this);
    this._buttonCancelClickHandler = this._buttonCancelClickHandler.bind(this);
  }

  init() {
    this._creatingFormComponent = new CreatingFormView(this._destinationsModel, this._offersPointModel, this._changeData);
    this._creatingFormComponent.setInnerHandlers();
    this._creatingFormComponent.setButtonCancelClickHandler(this._buttonCancelClickHandler);
    this._buttonElement.disabled = true;
    document.addEventListener('keydown', this._creatingFormEscKeyDownHandler);
    render(this._container, this._creatingFormComponent, RenderPosition.AFTERBEGIN);
    this._creatingFormComponent.setOfferChangeHandler();
  }

  setViewState(state) {
    this._creatingFormComponent.setFormState(state);
    this._destinationsModel.removeObserver();
    this._offersPointModel.removeObserver();
  }

  removeCreatingForm() {
    if (this._creatingFormComponent === null) {
      return;
    }
    this._creatingFormComponent.removeCalendarFormInput();
    this._offersPointModel.removeObserver();
    this._destinationsModel.removeObserver();
    completelyRemove(this._creatingFormComponent);
    this._creatingFormComponent = null;
    this._buttonElement.disabled = false;
    document.removeEventListener('keydown', this._creatingFormEscKeyDownHandler);
  }

  _creatingFormEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.removeCreatingForm();
      this._destinationsModel.removeObserver();
      this._offersPointModel.removeObserver();
    }
  }

  _buttonCancelClickHandler() {
    this.removeCreatingForm();
    document.removeEventListener('keydown', this._creatingFormEscKeyDownHandler);
  }
}
