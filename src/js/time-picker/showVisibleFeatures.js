export function showVisibleFeatures(timePicker, layers, view) {
  timePicker.clearFeatures();
  const extent = view.calculateExtent();
  for (const layer of layers) {
    timePicker.setFeatures(layer.getSource().getFeaturesInExtent(extent), layer);
  }
}
