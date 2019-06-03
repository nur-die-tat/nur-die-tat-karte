import { vectorLayerMenu } from './vectorLayerMenu.js'
import { createVectorLayerStyle } from './vectorLayerStyle'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { easeOut } from 'ol/easing'

import persons from '../../layers/persons.json'
import events from '../../layers/events.json'
import meetings from '../../layers/meetings.json'
import strike from '../../layers/strike.json'

const VECTORLAYERS = [
  {
    id: 'persons',
    name: 'Wohnorte',
    file: persons
  },
  {
    id: 'events',
    name: 'Veranstaltungen',
    file: events
  },
  {
    id: 'meetings',
    name: 'Treffpunkte',
    file: meetings
  },
  {
    id: 'strike',
    name: 'Arbeitskämpfe',
    file: strike
  }
]

export function vectorLayers (map, preLoader, icons) {
  const layers = []
  const format = new GeoJSON({
    featureProjection: map.getView().getProjection()
  })

  for (const layerDef of VECTORLAYERS) {
    preLoader.add(layerDef.file, 'txt')
    const layer = new VectorLayer({
      id: layerDef.id,
      name: layerDef.name,
      style: createVectorLayerStyle(icons),
      source: new VectorSource(),
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
      map.getView().animate({ zoom: 14, duration: 4000, easing: easeOut })
    }, 0)
  })

  vectorLayerMenu(layers)

  return layers
}
