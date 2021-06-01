const checkOfferTypes = (pointType, offer) => {
  for (const {type, offers} of offer) {
    if (type === pointType) {
      return offers;
    }
  }
};

const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};

const makeItemsUniq = (items) => [...new Set(items)];

const isOnline = () => {
  return window.navigator.onLine;
};

export {capitalizeFirstLetter, checkOfferTypes, makeItemsUniq, isOnline};
