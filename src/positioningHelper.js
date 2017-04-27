export function positioningHelper(map) {
  let showCoords = document.createElement('div');
  showCoords.style.marginTop = '50px';
  document.querySelector('#footer').appendChild(showCoords);

  map.on('click', e => {
    showCoords.innerText = e.coordinate;
  })
}