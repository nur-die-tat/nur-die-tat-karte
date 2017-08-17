import {baseLayerMenu} from "./baseLayerMenu.js";

export function baseLayers(map) {
  let layers = [
      new ol.layer.Tile({
      name: 'moderne Karte',
      source: new ol.source.OSM({
      url: 'https://{a-c}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
       }),
       visible: false
     }),
      
      new ol.layer.Group({
      name: 'Stadtkarte 1918',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            url: 'https://{a-c}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
          })
        }),
        new ol.layer.Tile({
          extent: [761390, 6597471, 795931, 6628039],
          source: new ol.source.TileImage({
            attributions: '&copy; Stadtarchiv Köln',
            url: 'http://www.die-karte.org/tiles/1918/{z}/{x}/{y}.png'
            // url: '../../nur-die-tat-karte-tiles/1918/{z}/{x}/{y}.png'
          }),
          maxResolution: 20
        })
      ],
      visible: false
    }),
      
      new ol.layer.Group({
      name: 'Stadtkarte 1925',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
            url: 'https://{a-c}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=6da7c1d64bc74008b2f01efffd1d20c0'
          })
        }),
        new ol.layer.Tile({
          extent: [762925.976821993, 6600392.669953008, 782254.7852501386, 6625204.937224803],
          source: new ol.source.TileImage({
            attributions: '&copy; Stadtarchiv Köln',
            url: 'http://www.die-karte.org/tiles/1925/{z}/{x}/{y}.png'
            // url: '../../nur-die-tat-karte-tiles/1925/{z}/{x}/{y}.png'
          }),
          maxResolution: 20
        })
      ],
      visible: true
    }),
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
  ];

  for (let l of layers) {
    map.addLayer(l);
  }

  baseLayerMenu(layers);

  return layers;
}
