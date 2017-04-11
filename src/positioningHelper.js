export function positioningHelper(map) {
  map.addLayer(new ol.layer.Vector({
    name: 'helping points',
    source: new ol.source.Vector({
      features: [
        new ol.Feature(new ol.geom.Point([774464.4974333522,6610916.576526965])),
        new ol.Feature(new ol.geom.Point([773027.6966115995,6607856.372557332])),
        new ol.Feature(new ol.geom.Point([769531.7034607447,6610164.889401366])), // melaten
        new ol.Feature(new ol.geom.Point([774985.9469427378,6619132.323174061])),
        new ol.Feature(new ol.geom.Point([779802.3381211573,6613742.008849275])) // stadtgarten kalk
      ]
    })
  }));

  let showCoords = document.createElement('div');
  showCoords.style.marginTop = '50px';
  document.querySelector('#footer').appendChild(showCoords);

  map.on('click', e => {
    showCoords.innerText = e.coordinate;
  })
}