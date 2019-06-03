import Feature from 'ol/Feature'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Modify from 'ol/interaction/Modify'
import Collection from 'ol/Collection'
import GeoJSON from 'ol/format/GeoJSON'
import { transform } from 'ol/proj'

export function positioningHelper (map) {
  let showCoords = document.createElement('div')
  showCoords.style.marginTop = '50px'
  document.querySelector('#footer').appendChild(showCoords)

  map.on('click', e => {
    showCoords.innerText = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
  })
}

export function lineHelper (map) {
  let showCoords = document.createElement('input')
  showCoords.type = 'text'
  showCoords.style.marginTop = '50px'
  showCoords.style.width = '100%'
  document.querySelector('#footer').appendChild(showCoords)

  let feature = new Feature()
  feature.setStyle(new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: 'rgba(255,255,255,0.2)'
      }),
      stroke: new Stroke({
        color: 'blue',
        width: 3
      })
    }),
    fill: new Fill({
      color: 'rgba(255,255,255,0.2)'
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 3
    })
  }))

  map.addLayer(new VectorLayer({
    source: new VectorSource({
      features: [feature]
    })
  }))

  let modifyInteraction = new Modify({
    features: new Collection([feature])
  })

  let geojsonFormat = new GeoJSON()

  showCoords.addEventListener('input', () => {
    let geom = geojsonFormat.readGeometry(showCoords.value, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    feature.setGeometry(geom)
    geom.on('change', () => {
      showCoords.value = geojsonFormat.writeGeometry(feature.getGeometry(), {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326'
      })
    })
  })

  map.addInteraction(modifyInteraction)

  modifyInteraction.setActive(true)
}
