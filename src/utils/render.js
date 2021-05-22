import Abstract from '../view/abstract.js';

const getSelectedDestinationData = (selectedDestinationName, destinations) => {
  for (const {name, description, pictures} of destinations) {
    if (selectedDestinationName === name) {
      return {description, pictures};
    }
  }
};

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, child, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

const removeNode = (component) => {
  component.getElement().remove();
};

const completelyRemove = (component) => {
  if (component === undefined || component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  if (document.contains(component.getElement())) {
    removeNode(component);
    component.removeElement();
  }
};

export {getSelectedDestinationData, RenderPosition, render, createElement, replace, completelyRemove};
