import {focusOnFeature} from "./focusOnFeature.js";
import {createImageModalLinks} from "./imageModal.js";

export function featureDetails(map, layers, timePicker) {
  map.on('click', e => {
    map.forEachFeatureAtPixel(e.pixel, (f, l) => {
      showFeatureDetails(map, layers, timePicker, f, l);
      return true;
    });
  });
  map.on('pointermove', e => {
    if (map.hasFeatureAtPixel(e.pixel)) {
      map.getViewport().style.cursor = 'pointer';
    }
    else {
      map.getViewport().style.cursor = 'auto';
    }
  })
}

function clearElement(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
}

let activeFeature;

export function showFeatureDetails(map, layers, timePicker, feature, layer) {
  if (activeFeature) {
    activeFeature.set('active', false);
  }

  if (feature === null) {
    document.querySelector('#details')
      .classList.add('hidden');
    timePicker.setFeature(null);
  }
  else {
    feature.set('active', true);
    activeFeature = feature;

    timePicker.setFeature(new Date(feature.get('begin')), new Date(feature.get('end')), feature.get('icon'));

    document.querySelector('#details')
      .classList.remove('hidden');

    document.querySelector('#feature-name')
      .innerHTML = feature.get('name');

    document.querySelector('#layer-name')
      .innerHTML = layer.get('name');

    let description = feature.get('description');
    description = Array.isArray(description) ? description : [description];

    let descContainer = document.querySelector('#feature-description');

    clearElement(descContainer);

    for (let descItem of description) {
      let p = document.createElement('p');
      p.innerHTML = descItem;
      descContainer.appendChild(p);
    }

    for (let featureLink of descContainer.querySelectorAll('.feature-link')) {
      featureLink.addEventListener('click', e => {
        focusOnFeature(map, layers, timePicker, featureLink.dataset.layer, parseInt(featureLink.dataset.feature));
        e.preventDefault();
      });
    }

    createImageModalLinks(descContainer);
      
    let sources = feature.get('sources');
    sources = Array.isArray(sources) ? sources : [sources];

    let sourcesContainer = document.querySelector('#feature-sources');

    clearElement(sourcesContainer);

    for (let sourcesItem of sources) {
      let li = document.createElement('li');
      li.innerHTML = sourcesItem;
      sourcesContainer.appendChild(li);
    }
  }
}
