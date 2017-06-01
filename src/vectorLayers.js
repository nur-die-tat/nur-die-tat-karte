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
    }),
      new ol.layer.Vector({
      name: 'Treffpunkte',
      source: new ol.source.Vector({
        url: '../layers/meetings.json',
        format: new ol.format.GeoJSON()
      })
    })
  ];

  for (let l of layers) {
    l.setStyle(vectorLayerStyle);
    map.addLayer(l);
  }

  showLayerMenu(layers);

  return layers;
}

function showLayerMenu(layers) {
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
    checkbox.classList.add('form-check-input');
    checkbox.checked = checked;
    label.appendChild(checkbox);
    let text = document.createTextNode(l.get('name'));
    label.innerHTML += '&nbsp;' + l.get('name');
    label.addEventListener('click', () => {
      checked = !checked;
      l.setVisible(checked);
    });
  }
}

