const getOfferTemplate = (typeOffers) => {
  const availableOffersContainer = document.querySelector('.event__available-offers');
  const sectionOffers = document.querySelector('.event__section--offers');
  sectionOffers.classList.remove('visually-hidden');
  availableOffersContainer.innerHTML = '';
  if (typeOffers.length > 0) {
    const templates = typeOffers.map(({title, price}) => {
      const offerTitle = [title].join('-');
      return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-1" type="checkbox" name="event-offer-${offerTitle}">
        <label class="event__offer-label" for="event-offer-${offerTitle}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
    });
    availableOffersContainer.innerHTML = `${templates.join(' ')}`;
  } else {
    sectionOffers.classList.add('visually-hidden');
  }
};

export {getOfferTemplate};
