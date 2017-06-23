import {vectorLayerStyle} from './vectorLayerStyle.js';
import {vectorLayerMenu} from "./vectorLayerMenu.js";

export function vectorLayers(map) {
  let layers = [
    new ol.layer.Vector({
      id: 'v1',
      name: 'Personen',
      source: new ol.source.Vector({
        url: '../layers/persons.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true
    }),
    new ol.layer.Vector({
        id: 'v2',
      name: 'Veranstaltungen',
      source: new ol.source.Vector({
        url: '../layers/events.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true
    }),
    new ol.layer.Vector({
        id: 'v3',
      name: 'Treffpunkte',
      source: new ol.source.Vector({
        url: '../layers/meetings.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true
    }),
    new ol.layer.Vector({
        id: 'v4',
      name: 'Arbeitskämpfe',
      source: new ol.source.Vector({
        url: '../layers/strike.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true
    })
  ];

  for (let l of layers) {
    l.setStyle(vectorLayerStyle);
    map.addLayer(l);
  }

  vectorLayerMenu(layers);

  return layers;
}
