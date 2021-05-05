const getPictureTemplate = (pictures) => {
  if (pictures) {
    const templates = pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`);
    return templates.join(' ');
  }
  return '';
};

export {getPictureTemplate};
