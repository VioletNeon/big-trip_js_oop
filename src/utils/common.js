const getRandomInteger = (from = 0, to = 1, pointer = 0) => {
  [from, to, pointer] = [Math.abs(from), Math.abs(to), Math.abs(pointer)];
  if (from >= to) {
    [from, to] = [to, from];
  }
  return +(Math.random() * Math.abs(to - from) + from).toFixed(pointer);
};

const getRandomItems = (array, arrayLength = array.length) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(0, getRandomInteger(0, arrayLength));
};

const getRandomItem = (someArray) => {
  const randomIndex = getRandomInteger(0, someArray.length - 1);

  return someArray[randomIndex];
};

const checkOfferTypes = (pointType, offer) => {
  for (const {type, offers} of offer) {
    if (type === pointType) {
      return offers;
    }
  }
};

const capitalizeFirstLetter = (string) => {
  if (!string) return string;

  return string[0].toUpperCase() + string.slice(1);
};

export {capitalizeFirstLetter, getRandomItem, getRandomItems, getRandomInteger, checkOfferTypes};
