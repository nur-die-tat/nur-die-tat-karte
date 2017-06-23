export function vectorLayerMenu(layers) {
  let target = document.querySelector('#vector-layer-selectors');

  for (let l of layers) {
    let checked = l.getVisible();
    let container = document.createElement('div');
    container.classList.add('form-check');
    container.classList.add('dropdown-item');
    target.appendChild(container);
    let label = document.createElement('label');
    label.classList.add('form-check-label');
    container.appendChild(label);
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = l.get('name');
    checkbox.classList.add('form-check-input');
    checkbox.checked = checked;
    label.appendChild(checkbox);
    label.innerHTML += '&nbsp;' + l.get('name');
    label.addEventListener('click', e => {
      if (e.target === label) {
        checked = !checked;
        l.setVisible(checked);
      }
    });
  }

  // hack for strange behaviour that removes checked state
  setTimeout(() => {
    for (let l of layers) {
      document.querySelector(`input[value="${l.get('name')}"]`).checked = l.getVisible();
    }
  },0)
}