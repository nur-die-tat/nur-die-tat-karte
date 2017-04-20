export function map() {
  let m = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    view: new ol.View({
      center: [ 778625.3068784528, 6612881.4882051535 ],
      zoom: 11
    })
  });

  window.map = m;

  return m;
}