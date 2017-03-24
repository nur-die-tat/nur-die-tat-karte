const pointStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7.5,
    stroke: new ol.style.Stroke({
      color: 'purple',
      width: 2
    })
  }),
  text: new ol.style.Text({
    font: '14px sans-serif',
    textAlign: 'left',
    textBaseline: 'middle',
    offsetX: 10
  }),
  zIndex: 2
});

const lineStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7.5,
    stroke: new ol.style.Stroke({
      color: 'purple',
      width: 2
    })
  }),
  stroke: new ol.style.Stroke({
    color: 'red',
    width : 4
  }),
  zIndex: 1
});

function createGeometryStyle(feature, resolution, geometry) {
  if (geometry instanceof ol.geom.Point) {
    let style = pointStyle.clone();
    style.setGeometry(geometry);

    if (feature.get('icon')) {
      switch (feature.get('icon')) {
      case 'flagw':
        style.setImage(new ol.style.Icon({
          anchor: [0.5, 1],
            src: '../icons/flagw.png'
          }));
          break;
        case 'event':
          style.setImage(new ol.style.Circle({
            radius: 7.5,
            stroke: new ol.style.Stroke({
              color: 'purple',
              width: 2
            })
          }));
          break;
        case 'house':
          style.setImage(new ol.style.Icon({
            anchor: [0.5, 1],
            src: '../icons/house.png'
          }));
          break;
      case 'peace':
        style.setImage(new ol.style.Icon({
          anchor: [0.5, 1],
            src: '../icons/peace.png'
          }));
        break;
      case 'theater':
        style.setImage(new ol.style.Icon({
          anchor: [0.5, 1],
            src: '../icons/theater.png'
          }));
        break;
      }
    }

    if (resolution < 39) {
      style.getText().setText(feature.get('name'));
    }

    return style;
  }
  else if (geometry instanceof ol.geom.LineString) {
    let style = lineStyle.clone();
    style.setGeometry(geometry);
    return style;
  }
}

export function vectorLayerStyle(feature, resolution) {
  if (feature.get('hidden')) {
    return null;
  }

  let geom = feature.getGeometry();
  if (geom instanceof ol.geom.GeometryCollection) {
    return geom.getGeometries().map(g => createGeometryStyle(feature, resolution, g));
  }
  else {
    return createGeometryStyle(feature, resolution, geom);
  }
}