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
  else if(resolution < 39) {
    var featureStyle = style.clone();
    featureStyle.getText().setText(feature.getProperties()['name']);
    return featureStyle;
  }
  else {
    return style;
  }
}