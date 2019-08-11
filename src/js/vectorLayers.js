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
import { VectorSourceLayerGroup } from './VectorSourceLayerGroup'
import { getCenter, getHeight, getWidth } from 'ol/extent'
import Cluster from 'ol/source/Cluster'
import Point from 'ol/geom/Point'

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
      source: new VectorSource(),
      visible: true
    })
    layers.push(layer)
  }

  const distance = 40

  function extentSmall (extent) {
    return getWidth(extent) + getHeight(extent) < 4 * map.getView().getResolution() * distance
  }

  const layer = new VectorLayer({
    source: new Cluster({
      source: new VectorSourceLayerGroup({
        layers
      }),
      geometryFunction: f => {
        if (f.get('hidden')) {
          return null
        }
        const geom = f.getGeometry()
        if (geom instanceof Point) {
          return geom
        } else if (extentSmall(geom.getExtent())) {
          return new Point(getCenter(geom.getExtent()))
        } else {
          return null
        }
      },
      distance
    }),
    style: createVectorLayerStyle(preLoader, icons),
    zIndex: 2,
    updateWhileAnimating: true,
    declutter: true
  })

  map.addLayer(layer)

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
