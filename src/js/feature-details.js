import {createImageModalLinks} from "./imageModal";
import {clearElement} from "./utils";
import {vectorLayerStyle} from "./vectorLayerStyle";
import {setMapQuery} from "./pages";
import {eventChannel} from "./eventChannel";

export class FeatureDetails {
  constructor (map, vectorLayers, timePicker) {
    this.map = map;
    this.vectorLayers = vectorLayers;
    this.timePicker = timePicker;

    this.highlightSource = new ol.source.Vector({
      features: []
    });

    this.map.addLayer(new ol.layer.Vector({
      source: this.highlightSource,
      style: vectorLayerStyle,
      zIndex: 10
    }));

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
    });

    this.detailsElement = document.querySelector('#details');
    this.featureNameElement = document.querySelector('#feature-name');
    this.layerNameElement = document.querySelector('#layer-name');
    this.featureDescriptionElement = document.querySelector('#feature-description');
    this.featureAddressElement = document.querySelector('#feature-address');
    this.featureSourcesElement = document.querySelector('#feature-sources');

    eventChannel.addEventListener('mapQuery', function (e) {
      this.focusOnFeatureByIds(parseInt(e.detail['feature']), e.detail['layer']);
    }.bind(this));
  }

  focusOnFeatureByIds (featureId, layerId) {
    let layer = this.vectorLayers.find(l => l.get('id') === layerId);
    let feature = layer.getSource().getFeatures().find(f => f.getId() === featureId);
    if (!feature) {
      setTimeout(function () {
        this.focusOnFeatureByIds(featureId, layerId);
      }.bind(this), 200);
    } else {
      this.map.getView().animate({center: ol.extent.getCenter(feature.getGeometry().getExtent())});
      this.showFeatureDetails(feature, layer);
    }
  }

  showFeatureDetails(feature, layer) {
    if (this.activeFeature) {
      this.activeFeature.set('active', false);
      this.highlightSource.clear();
    }

    if (feature === null || this.activeFeature === feature) {
      this.activeFeature = null;
      document.querySelector('#details')
        .classList.add('hidden');
      this.timePicker.unsetFeature();
      setMapQuery(null, null);
    } else {
      feature.set('active', true);

      this.highlightSource.addFeature(feature);

      this.activeFeature = feature;

      this.timePicker.setFeature(new Date(feature.get('begin')), new Date(feature.get('end')), feature.get('icon'));

      this.detailsElement.classList.remove('hidden');

      this.featureNameElement.innerHTML = feature.get('name');

      this.layerNameElement.innerHTML = layer.get('name');

      if (feature.get('address')) {
        this.featureAddressElement.classList.remove('hidden');
        this.featureAddressElement.innerHTML = feature.get('address');
      } else {
        this.featureAddressElement.classList.add('hidden');
      }

      let description = feature.get('description');
      description = Array.isArray(description) ? description : [description];

      clearElement(this.featureDescriptionElement);

      for (let descItem of description) {
        let p = document.createElement('p');
        p.innerHTML = descItem;
        this.featureDescriptionElement.appendChild(p);
      }

      for (let featureLink of this.featureDescriptionElement.querySelectorAll('.feature-link')) {
        featureLink.addEventListener('click', e => {
          this.focusOnFeatureByIds(parseInt(featureLink.dataset.feature), featureLink.dataset.layer);
          e.preventDefault();
        });
      }

      createImageModalLinks(this.featureDescriptionElement);

      let sources = feature.get('sources');
      sources = Array.isArray(sources) ? sources : [sources];

      clearElement(this.featureSourcesElement);

      for (let sourcesItem of sources) {
        let li = document.createElement('li');
        li.innerHTML = sourcesItem;
        this.featureSourcesElement.appendChild(li);
      }

      setMapQuery(feature.getId(), layer.get('id'));
    }
  }
}
