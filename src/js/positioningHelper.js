/* globals ol */

export function positioningHelper (map) {
  let showCoords = document.createElement('div')
  showCoords.style.marginTop = '50px'
  document.querySelector('#footer').appendChild(showCoords)

  map.on('click', e => {
    showCoords.innerText = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
  })
}

export function lineHelper (map) {
  let showCoords = document.createElement('input')
  showCoords.type = 'text'
  showCoords.style.marginTop = '50px'
  showCoords.style.width = '100%'
  document.querySelector('#footer').appendChild(showCoords)

  let feature = new ol.Feature()
  feature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 3
      })
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: 'blue',
      width: 3
    })
  }))

  map.addLayer(new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature]
    })
  }))

  let modifyInteraction = new ol.interaction.Modify({
    features: new ol.Collection([feature])
  })

  let geojsonFormat = new ol.format.GeoJSON()

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
