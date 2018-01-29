import {vectorLayerStyle} from './vectorLayerStyle.js';
import {vectorLayerMenu} from "./vectorLayerMenu.js";

export function vectorLayers(map) {
  let layers = [
    new ol.layer.Vector({
      id: 'persons',
      name: 'Personen',
      source: new ol.source.Vector({
        url: '../layers/persons.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      zIndex: 2
    }),
    new ol.layer.Vector({
      id: 'events',
      name: 'Veranstaltungen',
      source: new ol.source.Vector({
        url: '../layers/events.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      zIndex: 2
    }),
    new ol.layer.Vector({
      id: 'meetings',
      name: 'Treffpunkte',
      source: new ol.source.Vector({
        url: '../layers/meetings.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      zIndex: 2
    }),
    new ol.layer.Vector({
      id: 'strike',
      name: 'Arbeitskämpfe',
      source: new ol.source.Vector({
        url: '../layers/strike.json',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      zIndex: 2
    })
  ];

  for (let l of layers) {
    l.setStyle(vectorLayerStyle);
    map.addLayer(l);
  }

  vectorLayerMenu(layers);

  return layers;
}
