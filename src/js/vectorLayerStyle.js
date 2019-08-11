import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'
import Point from 'ol/geom/Point'
import Icon from 'ol/style/Icon'
import LineString from 'ol/geom/LineString'
import GeometryCollection from 'ol/geom/GeometryCollection'

let clusterStyleNorm, clusterStyleActive

export const labelStyle = new Style({
  text: new Text({
    font: '18px \'Josefin Slab\', serif',
    textAlign: 'left',
    textBaseline: 'middle',
    offsetX: 25,
    offsetY: -20,
    stroke: new Stroke({
      color: 'White',
      width: 6
    }),
    overflow: true
  }),
  zIndex: 2
})

const lineStyle = new Style({
  stroke: new Stroke({
    color: 'rgb(248, 126, 126)',
    width: 4
  }),
  zIndex: 1
})

export const networkStyle = new Style({
  stroke: new Stroke({
    color: 'rgb(255, 0, 0)',
    width: 4,
    lineDash: [10, 20],
    lineCap: 'round'
  })
})

function createGeometryStyle (feature, resolution, geometry, icons) {
  const styles = []

  if (geometry instanceof Point && feature.get('icon')) {
    const img = icons.get(feature.get('icon'), feature.get('active'))
    styles.push(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        img,
        imgSize: [ img.width, img.height ]
      }),
      geometry
    }))
  } else if (geometry instanceof LineString) {
    lineStyle.setGeometry(geometry)
    styles.push(lineStyle)
  }

  // if (resolution < 10 || feature.get('hover')) {
  const style = labelStyle.clone()
  style.setGeometry(geometry)
  style.getText().setText(feature.get('name'))
  styles.push(style)
  // }

  return styles
}

export function createVectorLayerStyle (preLoader, icons) {
  preLoader.on('ready', () => {
    const imgNorm = icons.get('empty', false)
    clusterStyleNorm = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        img: imgNorm,
        imgSize: [imgNorm.width, imgNorm.height]
      }),
      text: new Text({
        font: '18px \'Josefin Slab\', serif',
        textAlign: 'center',
        textBaseline: 'middle',
        offsetX: 0,
        offsetY: -20
      })
    })

    let imgActive = icons.get('empty', true)
    clusterStyleActive = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        img: imgActive,
        imgSize: [imgActive.width, imgActive.height]
      }),
      text: new Text({
        font: '18px \'Josefin Slab\', serif',
        textAlign: 'center',
        textBaseline: 'middle',
        offsetX: 0,
        offsetY: -20
      })
    })
  })

  return function vectorLayerStyle (feature, resolution) {
    if (feature.get('features').length > 1) {
      // cluster style
      const style = feature.get('features').some(f => f.get('active')) ? clusterStyleActive : clusterStyleNorm
      style.getText().setText(feature.get('features').length.toString())
      return style
    } else {
      // normal style
      feature = feature.get('features')[0]

      if (feature.get('hidden')) {
        return null
      }

      let geom = feature.getGeometry()
      if (geom instanceof GeometryCollection) {
        return geom.getGeometries().reduce((styles, geom) => {
          return styles.concat(...createGeometryStyle(feature, resolution, geom, icons))
        }, [])
      } else {
        return createGeometryStyle(feature, resolution, geom, icons)
      }
    }
  }
}
