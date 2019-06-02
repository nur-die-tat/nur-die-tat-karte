import ol from 'openlayers';

const pointStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7.5,
    stroke: new ol.style.Stroke({
      color: 'purple',
      width: 2
    })
  }),
  text: new ol.style.Text({
    font: '18px \'Josefin Slab\', serif',
    textAlign: 'left',
    textBaseline: 'middle',
    offsetX: 20,
    offsetY: -20,
    stroke: new ol.style.Stroke({
      color: 'White',
      width: 6
    })
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
    width: 4
  }),
  zIndex: 1
});

export const networkStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'black',
    width: 2
  })
});

function createGeometryStyle(feature, resolution, geometry, icons) {
  if (geometry instanceof ol.geom.Point) {
    let style = pointStyle.clone();
    style.setGeometry(geometry);

    if (feature.get('icon')) {
      let iconOptions = {
        anchor: [0.5, 1]
      };

      let img = icons.get(feature.get('icon'), feature.get('active'));
      iconOptions.img = img;
      iconOptions.imgSize = [ img.width, img.height ];

      style.setImage(new ol.style.Icon(iconOptions));
    }

    if (resolution < 10 || feature.get('hover')) {
      style.getText().setText(feature.get('name'));
    }

    if (feature.get('hover')) {
      style.setZIndex(2);
    }

    return style;
  }
  else if (geometry instanceof ol.geom.LineString) {
    let style = lineStyle.clone();
    style.setGeometry(geometry);
    return style;
  }
}

export function createVectorLayerStyle(icons) {
  return function vectorLayerStyle(feature, resolution) {
    if (feature.get('hidden')) {
      return null;
    }

    let geom = feature.getGeometry();
    if (geom instanceof ol.geom.GeometryCollection) {
      return geom.getGeometries().map(g => createGeometryStyle(feature, resolution, g, icons));
    }
    else {
      return createGeometryStyle(feature, resolution, geom, icons);
    }
  }
}