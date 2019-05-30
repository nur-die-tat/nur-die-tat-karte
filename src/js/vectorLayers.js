import {vectorLayerStyle} from './vectorLayerStyle.js';
import {vectorLayerMenu} from "./vectorLayerMenu.js";
import {eventChannel} from "./eventChannel";

export function vectorLayers(map) {
  let layers = [
    new ol.layer.Vector({
      id: 'persons',
      name: 'Wohnorte',
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

  let count = layers.length;

  for (let l of layers) {
    l.getSource().once('addfeature', () => {
      count--;
      if (count === 0) {
        setTimeout(() => {
          eventChannel.dispatchLayerLoaded();
          map.getView().animate({ zoom: 14, duration: 2000, easing: ol.easing.easeOut });
        }, 1000);
      }
    });
    l.setStyle(vectorLayerStyle);
    map.addLayer(l);
  }

  vectorLayerMenu(layers);

  return layers;
}
