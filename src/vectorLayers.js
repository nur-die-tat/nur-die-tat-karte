import {Observable} from '../node_modules/rxjs/bundles/rx.js';
import {vectorLayerStyle} from './vectorLayerStyle.js';

export function vectorLayers(map) {
  let layers = [
    new ol.layer.Vector({
      name: 'Personen',
      source: new ol.source.Vector({
        url: '../layers/persons.json',
        format: new ol.format.GeoJSON()
      })
    }),
      new ol.layer.Vector({
      name: 'Veranstaltungen',
      source: new ol.source.Vector({
        url: '../layers/events.json',
        format: new ol.format.GeoJSON()
      })
    })
  ];

  for (let l of layers) {
    l.setStyle(vectorLayerStyle)
    map.addLayer(l);
  }

  showLayerMenu(layers);

  return layers;
}

function showLayerMenu(layers) {
  let target = document.querySelector('#layer-selectors');

  for (let l of layers) {
    let checked = l.getVisible();
    let selection = document.createElement('div');
    target.appendChild(selection);
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    selection.appendChild(checkbox);
    let text = document.createTextNode(l.get('name'));
    selection.appendChild(text);
    selection.addEventListener('click', () => {
      checked = !checked;
      l.setVisible(checked);
    });
  }
}

