const getOfferTemplate = (typeOffers, isLoading = true, pointOffers) => {
  const availableOffersContainer = document.querySelector('.event__available-offers');
  const sectionOffers = document.querySelector('.event__section--offers');
  sectionOffers.classList.remove('visually-hidden');
  availableOffersContainer.innerHTML = '';
  let isSelectedOffer = false;
  if (typeOffers.length > 0) {
    const templates = typeOffers.map(({title, price}) => {
      if (!isLoading) { isSelectedOffer = pointOffers.map((item) => item.title).includes(title); }
      const offerTitle = [title].join('-');
      return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-1" ${isSelectedOffer ? 'checked' : ''} data-title="${title}" data-price="${price}" type="checkbox" name="event-offer-${offerTitle}">
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
