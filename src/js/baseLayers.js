import { baseLayerMenu } from './baseLayerMenu.js'
import { Group } from 'ol/layer'
import TileLayer from 'ol/layer/Tile'
import TileImageSource from 'ol/source/TileImage'
import OSMSource from 'ol/source/OSM'

export function baseLayers (map) {
  let layers = [
    new Group({
      name: 'Historische Karten',
      layers: [
        new TileLayer({
          extent: [762925.976821993, 6600392.669953008, 782254.7852501386, 6625204.937224803],
          source: new TileImageSource({
            attributions: 'hist. Karte &copy; Stadtarchiv Köln',
            url: 'http://www.die-karte.org/tiles/1925/{z}/{x}/{y}.png'
            // url: '../../nur-die-tat-karte-tiles/1925/{z}/{x}/{y}.png'
          }),
          maxResolution: 9, // from 15
          minResolution: 1, // to 17
          zIndex: 1
        }),
        new TileLayer({
          // extent: [761390, 6597471, 795931, 6628039],
          source: new TileImageSource({
            attributions: 'hist. Karte: LAV NRW Rheinland',
            url: 'http://www.die-karte.org/tiles/duesseldorf-koeln_94b_100000/{z}/{x}/{y}.png'
          }),
          minResolution: 9, // from 13
          maxResolution: 20, // to 14
          zIndex: 1
        }),
        new TileLayer({
          // extent: [761390, 6597471, 795931, 6628039],
          source: new TileImageSource({
            attributions: 'hist. Karte: LAV NRW Rheinland',
            url: 'http://www.die-karte.org/tiles/duesseldorf-koeln_94b_100000/{z}/{x}/{y}.png'
          }),
          minResolution: 9, // from 13
          maxResolution: 20, // to 14
          zIndex: 1
        }),
        new TileLayer({
          // extent: [761390, 6597471, 795931, 6628039],
          source: new TileImageSource({
            attributions: 'hist. Karte: LAV NRW Rheinland',
            url: 'http://www.die-karte.org/tiles/krefeld-essen_82b_100000/{z}/{x}/{y}.png'
          }),
          minResolution: 9, // from 13
          maxResolution: 20, // to 14
          zIndex: 1
        }),
        // new ol.layer.Tile({
        //   // extent: [761390, 6597471, 795931, 6628039],
        //   source: new ol.source.TileImage({
        //     attributions: 'hist. Karte: LAV NRW',
        //     url: 'http://www.die-karte.org/tiles/200000/{z}/{x}/{y}.png'
        //   }),
        //   minResolution: 20,
        //   maxResolution: 160,
        //   zIndex: 1
        // }),
        new TileLayer({
          source: new OSMSource({
            attributions: [
              'Karte &copy; <a href="http://www.thunderforest.com">Thunderforest</a>',
              'Daten &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
              'Icons &copy; <a href="https://mapicons.mapsmarker.com">Map Icons Collection</a>'
            ],
            url: 'https://{a-c}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
          }),
          zIndex: 0
        })
      ],
      visible: true
    }),

    new TileLayer({
      name: 'Nur moderne Karte',
      source: new OSMSource({
        attributions: [
          'Karte &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          'Icons &copy; <a href="https://mapicons.mapsmarker.com">Map Icons Collection</a>'
        ]
      }),
      visible: false,
      zIndex: 0
    })
    //
    //   name: 'test',
    //   // extent: [761390, 6597471, 795931, 6628039],
    //   source: new ol.source.TileImage({
    //     // attributions: '&copy; Stadtarchiv Köln',
    //     // url: 'http://diekarte.musca.uberspace.de/tiles/1918/{z}/{x}/{y}.png'
    //     url: 'http://localhost/nur-die-tat-karte-tiles/putzger/{z}/{x}/{y}.png'
    //   }),
    //   visible: false
    // })
    // new ol.layer.Tile({
    // new ol.layer.Tile({
    //   name: 'mobile atlas',
    //   source: new ol.source.OSM({
    //     url: 'https://{a-c}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
    //   }),
    //   visible: false
    // }),
    // new ol.layer.Image({
    //   name: 'NRW GeoServer',
    //   source: new ol.source.ImageWMS({
    //     serverType: 'mapserver',
    //     url: 'http://www.wms.nrw.de/geobasis/wms_nw_tk25_1936-1945?',
    //     params: {
    //       FORMAT: 'image/png',
    //       LAYERS: 'nw_tk25_1936-1945'
    //     },
    //     crossOrigin: ''
    //   }),
    //   visible: false
    // }),
    // new ol.layer.Image({
    //   name: 'NRW GeoServer 2',
    //   source: new ol.source.ImageWMS({
    //     serverType: 'mapserver',
    //     url: 'http://www.wms.nrw.de/geobasis/wms_nw_neuaufnahme?',
    //     params: {
    //       FORMAT: 'image/png',
    //       LAYERS: 'nw_neuaufnahme'
    //     },
    //     crossOrigin: ''
    //   }),
    //   visible: false
    // }),
    // new ol.layer.Tile({
    //   name: 'Modern',
    //   source: new ol.source.OSM(),
    //   visible: false
    // })
  ]

  for (let l of layers) {
    map.addLayer(l)
  }

  baseLayerMenu(layers)

  return layers
}
