/* globals ol */

import { vectorLayerMenu } from './vectorLayerMenu.js'
import { createVectorLayerStyle } from './vectorLayerStyle'

const VECTORLAYERS = [
  {
    id: 'persons',
    name: 'Wohnorte',
    file: '../layers/persons.json'
  },
  {
    id: 'events',
    name: 'Veranstaltungen',
    file: '../layers/events.json'
  },
  {
    id: 'meetings',
    name: 'Treffpunkte',
    file: '../layers/meetings.json'
  },
  {
    id: 'strike',
    name: 'Arbeitskämpfe',
    file: '../layers/strike.json'
  }
]

export function vectorLayers (map, preLoader, icons) {
  const layers = []
  const format = new ol.format.GeoJSON({
    featureProjection: map.getView().getProjection()
  })

  for (const layerDef of VECTORLAYERS) {
    preLoader.add(layerDef.file, 'txt')
    const layer = new ol.layer.Vector({
      id: layerDef.id,
      name: layerDef.name,
      style: createVectorLayerStyle(icons),
      source: new ol.source.Vector(),
      visible: true,
      zIndex: 2
    })
    layers.push(layer)
    map.addLayer(layer)
  }

  preLoader.on('ready', () => {
    for (let i = 0; i < VECTORLAYERS.length; i++) {
      layers[i].getSource().addFeatures(format.readFeatures(preLoader.get(VECTORLAYERS[i].file)))
    }

    setTimeout(() => {
      map.getView().animate({ zoom: 14, duration: 4000, easing: ol.easing.easeOut })
    }, 0)
  })

  vectorLayerMenu(layers)

  return layers
}
