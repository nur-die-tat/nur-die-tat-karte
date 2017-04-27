import {Observable} from '../node_modules/rxjs/bundles/rx.js';
import {calculateExtent} from "./calculateExtent.js";

export function baseLayers(map) {
  let layers = [
    new ol.layer.Group({
        name: 'industrial',
        layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM({
                  url: 'https://{a-c}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
              })
            }),
            new ol.layer.Image({
              source: new ol.source.ImageStatic({
                url: '../layers/1925-industrial_modified.jpg',
                imageExtent: [762925.976821993, 6600392.669953008, 782254.7852501386, 6625204.937224803]
              }),
              maxResolution: 20
            })
        ],
        visible: false
    }),
      new ol.layer.Tile({
      name: 'transport',
      source: new ol.source.OSM({
          url: 'https://{a-c}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
      }),
      visible: false
    }),
      new ol.layer.Tile({
      name: 'mobile atlas',
      source: new ol.source.OSM({
          url: 'https://{a-c}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
      }),
      visible: false
    }),
    new ol.layer.Image({
      name: 'NRW GeoServer',
      source: new ol.source.ImageWMS({
        serverType: 'mapserver',
        url: 'http://www.wms.nrw.de/geobasis/wms_nw_tk25_1936-1945?',
        params: {
          FORMAT: 'image/png',
          LAYERS: 'nw_tk25_1936-1945'
        },
        crossOrigin: ''
      }),
      visible: false
    }),
    new ol.layer.Image({
      name: 'NRW GeoServer 2',
      source: new ol.source.ImageWMS({
        serverType: 'mapserver',
        url: 'http://www.wms.nrw.de/geobasis/wms_nw_neuaufnahme?',
        params: {
          FORMAT: 'image/png',
          LAYERS: 'nw_neuaufnahme'
        },
        crossOrigin: ''
      }),
      visible: false
    }),
    new ol.layer.Tile({
      name: 'Modern',
      source: new ol.source.OSM()
    })
  ];

  for (let l of layers) {
    map.addLayer(l);
  }

  showLayerMenu(layers);

  return layers;
}

function showLayerMenu(layers) {
  let target = document.querySelector('#base-layer-selectors');

  let visibleLayer;

  for (let l of layers) {
    let checked = l.getVisible();
    if (checked) {
      visibleLayer = l;
    }
    let selection = document.createElement('div');
    target.appendChild(selection);
    let checkbox = document.createElement('input');
    checkbox.name = 'base-layer';
    checkbox.type = 'radio';
    checkbox.checked = checked;
    selection.appendChild(checkbox);
    let text = document.createTextNode(l.get('name'));
    selection.appendChild(text);
    selection.addEventListener('click', () => {
      visibleLayer.setVisible(true);
      l.setVisible(true);
      visibleLayer = l;
    });
  }
}



