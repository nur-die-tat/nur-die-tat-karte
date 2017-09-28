export function vectorLayerMenu(layers) {
  let target = document.querySelector('#themen-dropdown .dropdown-menu');

  let clicked = false;
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
      if (e.target.tagName === 'INPUT') {
        checked = !checked;
        l.setVisible(checked);
        clicked = true;
      }
    });
  }

  $('#themen-dropdown').on('hide.bs.dropdown', e => {
    if (clicked) {
      e.preventDefault();
      e.stopPropagation();
      clicked = false;
    }
  });

  // hack for strange behaviour that removes checked state
  setTimeout(() => {
    for (let l of layers) {
      document.querySelector(`input[value="${l.get('name')}"]`).checked = l.getVisible();
    }
  },0)
}