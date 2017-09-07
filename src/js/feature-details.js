import {createImageModalLinks} from "./imageModal";

function clearElement(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
}

export class FeatureDetails {
  constructor (map, vectorLayers, timePicker) {
    this.map = map;
    this.vectorLayers = vectorLayers;
    this.timePicker = timePicker;

    map.on('click', e => {
      map.forEachFeatureAtPixel(e.pixel, (f, l) => {
        this.showFeatureDetails(f, l);
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

  focusOnFeatureByIds (featureId, layerId) {
    let layer = this.vectorLayers.find(l => l.get('id') === layerId);
    let feature = layer.getSource().getFeatures().find(f => f.get('id') === featureId);
    this.map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));
    this.showFeatureDetails(feature, layer);
  }

  showFeatureDetails(feature, layer) {
    if (this.activeFeature) {
      this.activeFeature.set('active', false);
    }

    if (feature === null) {
      document.querySelector('#details')
        .classList.add('hidden');
      this.timePicker.setFeature(null);
    }
    else {
      feature.set('active', true);
      this.activeFeature = feature;

      this.timePicker.setFeature(new Date(feature.get('begin')), new Date(feature.get('end')), feature.get('icon'));

      document.querySelector('#details').classList.remove('hidden');

      document.querySelector('#feature-name').innerHTML = feature.get('name');

      document.querySelector('#layer-name').innerHTML = layer.get('name');

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
          this.focusOnFeatureByIds(parseInt(featureLink.dataset.feature), featureLink.dataset.layer);
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
}
