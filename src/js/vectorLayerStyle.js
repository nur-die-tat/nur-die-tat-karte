import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'
import Point from 'ol/geom/Point'
import Icon from 'ol/style/Icon'
import LineString from 'ol/geom/LineString'
import GeometryCollection from 'ol/geom/GeometryCollection'

const pointStyle = new Style({
  image: new CircleStyle({
    radius: 7.5,
    stroke: new Stroke({
      color: 'purple',
      width: 2
    })
  }),
  text: new Text({
    font: '18px \'Josefin Slab\', serif',
    textAlign: 'left',
    textBaseline: 'middle',
    offsetX: 20,
    offsetY: -20,
    stroke: new Stroke({
      color: 'White',
      width: 6
    })
  }),
  zIndex: 2
})

const lineStyle = new Style({
  image: new CircleStyle({
    radius: 7.5,
    stroke: new Stroke({
      color: 'purple',
      width: 2
    })
  }),
  stroke: new Stroke({
    color: 'red',
    width: 4
  }),
  zIndex: 1
})

export const networkStyle = new Style({
  stroke: new Stroke({
    color: 'black',
    width: 2
  })
})

function createGeometryStyle (feature, resolution, geometry, icons) {
  if (geometry instanceof Point) {
    let style = pointStyle.clone()
    style.setGeometry(geometry)

    if (feature.get('icon')) {
      let iconOptions = {
        anchor: [0.5, 1]
      }

      let img = icons.get(feature.get('icon'), feature.get('active'))
      iconOptions.img = img
      iconOptions.imgSize = [ img.width, img.height ]

      style.setImage(new Icon(iconOptions))
    }

    if (resolution < 10 || feature.get('hover')) {
      style.getText().setText(feature.get('name'))
    }

    if (feature.get('hover')) {
      style.setZIndex(2)
    }

    return style
  } else if (geometry instanceof LineString) {
    let style = lineStyle.clone()
    style.setGeometry(geometry)
    return style
  }
}

export function createVectorLayerStyle (icons) {
  return function vectorLayerStyle (feature, resolution) {
    if (feature.get('hidden')) {
      return null
    }

    let geom = feature.getGeometry()
    if (geom instanceof GeometryCollection) {
      return geom.getGeometries().map(g => createGeometryStyle(feature, resolution, g, icons))
    } else {
      return createGeometryStyle(feature, resolution, geom, icons)
    }
  }
}
