export function featureDetails(map) {
  showFeatureDetails(null);
  map.on('click', e => {
    map.forEachFeatureAtPixel(e.pixel, f => showFeatureDetails(f));
  })
}

function clearElement(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
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

    let description = feature.get('description');
    description = Array.isArray(description) ? description : [description];

    let descContainer = document.querySelector('#feature-description');

    clearElement(descContainer);

    for (let descItem of description) {
      let p = document.createElement('p');
      p.textContent = descItem;
      descContainer.appendChild(p);
    }

    let sources = feature.get('sources');
    sources = Array.isArray(sources) ? sources : [sources];

    let sourcesContainer = document.querySelector('#feature-sources');

    clearElement(sourcesContainer);

    for (let sourcesItem of sources) {
      let li = document.createElement('li');
      li.textContent = sourcesItem;
      sourcesContainer.appendChild(li);
    }
  }
}
