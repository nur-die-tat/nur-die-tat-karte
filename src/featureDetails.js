export function featureDetails(map) {
  showFeatureDetails(null);
  map.on('click', e => {
    map.forEachFeatureAtPixel(e.pixel, f => showFeatureDetails(f));
  })
}

function showFeatureDetails(feature) {
  if (feature === null) {
    document.querySelector('#details-content')
      .classList.add('hidden');
  }
  else {
    document.querySelector('#details-content')
      .classList.remove('hidden');

    document.querySelector('#feature-name')
      .textContent = feature.get('name');

    document.querySelector('#feature-description')
      .textContent = feature.get('description');
  }
}
