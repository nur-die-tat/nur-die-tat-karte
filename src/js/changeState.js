const mapQuery = {};

export function changePage(hash) {
  const state = { hash };
  let search;
  if (hash === '#karte') {
    const search = '?' + Object.entries(mapQuery).map(function (kv) {
        return kv.join('=');
      }).join('&');
    state.search = search;
  }
  history.pushState(state, '', createPath(hash, search));
  showTab(hash);
}

history.addEventlistener('popstate', function (state) {
  showTab(state.hash);
});

function showTab(hash) {
  $(`a[data-toggle="tab"][data-target="${hash}-tab"]`).show();
}

export function getMapQuery() {
  return mapQuery;
}

export function setMapQuery(feature, layer) {
  if (feature === undefined) {
    delete mapQuery['feature'];
  } else {
    mapQuery['feature'] = feature;
  }
  if (layer === undefined) {
    delete mapQuery['layer'];
  } else {
    mapQuery['layer'] = layer;
  }
}

function createPath(hash, search) {
  let path = window.location.pathname;
  if (search) {
    path += search;
  }
  path += hash;
  return path;
}

export function init() {
  const search = window.location.search;
  for (let keyVal of search.substr(1).split('&')) {
    const [key, val] = keyVal.split('=');
    mapQuery[key] = val;
  }
  const hash = window.location.hash || '#karte';
  history.replaceState({ hash, search }, '', createPath(hash, search));
  showTab(hash);
}