var style = new ol.style.Style({
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
  })
});

export function vectorLayerStyle(feature, resolution) {
  if (feature.get('hidden')) {
    return null;
  }

  var featureStyle = style.clone();

  if (feature.get('icon')) {
    switch (feature.get('icon')) {
      case 'keyword':
        // feature.setImage(new ol.style.Icon({
        //
        // }));
        featureStyle.setImage(new ol.style.Circle({
          radius: 7.5,
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
          })
        }));
        break;
    }
  }

  if(resolution < 39) {
    featureStyle.getText().setText(feature.get('name'));
    return featureStyle;
  }
  else {
    return featureStyle;
  }
}