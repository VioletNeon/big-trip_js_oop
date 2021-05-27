const getEmptyMap = (items) => {
  const Map = {};
  items.forEach((item) => Map[item] = 0);
  return Map;
};

const getSortedDataLabels = (someMap) => {
  const typeLabels = [];
  const labelsData = [];
  const sortedItems = Object.entries(someMap).sort(([, countA], [, countB]) => countB - countA);
  sortedItems.forEach(([type, count]) => {
    typeLabels.push(type.toUpperCase());
    labelsData.push(count);
  });
  return [typeLabels, labelsData];
};

export {getEmptyMap, getSortedDataLabels};
