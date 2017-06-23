// import {Observable} from '../node_modules/rxjs/bundles/rx.js';
// import {calculateExtent} from "./calculateExtent.js";

export function baseLayerMenu(layers) {
  let target = document.querySelector('#base-layer-selectors');

  let visibleLayer;

  for (let l of layers) {
    let checked = l.getVisible();
    if (checked) {
      visibleLayer = l;
    }
    let container = document.createElement('div');
    container.classList.add('form-check');
    container.classList.add('dropdown-item');
    target.appendChild(container);
    let label = document.createElement('label');
    label.classList.add('form-check-label');
    container.appendChild(label);
    let checkbox = document.createElement('input');
    checkbox.name = 'base-layer';
    checkbox.type = 'radio';
    checkbox.value = l.get('name')
    checkbox.classList.add('form-check-input');
    checkbox.checked = checked;
    label.appendChild(checkbox);
    label.innerHTML += '&nbsp;' + l.get('name');
    label.addEventListener('click', () => {
      visibleLayer.setVisible(false);
      l.setVisible(true);
      visibleLayer = l;
    });
  }

  // hack for strange behaviour that removes checked state
  setTimeout(() => {
    for (let l of layers) {
      document.querySelector(`input[value="${l.get('name')}"]`).checked = l.getVisible();
    }
  },0)
}