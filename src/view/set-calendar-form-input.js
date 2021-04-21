import flatpickr from 'flatpickr';

const setCalendarFormInput = () => {
  const eventTimeInput = document.querySelectorAll('.event__input--time');
  if (eventTimeInput.length > 0) {
    eventTimeInput.forEach((item) => {
      flatpickr(item, {
        enableTime: true,
        dateFormat: 'y/m/d H:i',
      });
    });
  }
};

export {setCalendarFormInput};
