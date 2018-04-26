import {createMap} from './js/map';
import {tabs} from './js/tabs';

import './css/design.css';

const query = {};
for (let keyVal of window.location.search.substr(1).split('&')) {
  const [key, val] = keyVal.split('=');
  query[key] = val;
}
window.query = query;

$('a[data-toggle="tab"][data-target="#karte-tab"]')
  .one('loaded.tab', () => {
    createMap();
  });

tabs();

