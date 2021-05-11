import {getPictureTemplate} from './get-picture-template.js';

const getDestinationTemplate = (destination) => {
  const sectionDestination = document.querySelector('.event__section--destination');
  sectionDestination.classList.remove('visually-hidden');
  sectionDestination.innerHTML = '';
  const {description, pictures} = destination;
  const destinationPictures = getPictureTemplate(pictures);
  if (description || destinationPictures.length > 0) {
    const template = `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description ${description ? '' : 'visually-hidden'}">${description}</p>
      <div class="event__photos-container ${destinationPictures ? '' : 'visually-hidden'}">
        <div class="event__photos-tape">
          ${destinationPictures}
        </div>
      </div>`;
    sectionDestination.innerHTML = `${template}`;
  } else {
    sectionDestination.classList.add('visually-hidden');
  }
};

export {getDestinationTemplate};
