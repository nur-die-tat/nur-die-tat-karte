import { vectorLayerMenu } from './vectorLayerMenu.js'
import { createVectorLayerStyle } from './vectorLayerStyle'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { easeOut } from 'ol/easing'

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
