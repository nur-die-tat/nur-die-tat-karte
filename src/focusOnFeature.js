import {showFeatureDetails} from "./featureDetails.js";

export function focusOnFeature(map, layers, layerId, featureId) {
  let layer = layers.find(l => l.get('id') === layerId);
  let feature = layer.getSource().getFeatures().find(f => f.get('id') === featureId);
  map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));
  showFeatureDetails(map, layers, feature, layer);
}