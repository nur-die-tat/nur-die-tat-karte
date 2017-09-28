import {createMap} from './js/map';
import {tabs} from './js/tabs';

import './css/design.css';

$('a[data-toggle="tab"][data-target="#karte-tab"]')
  .one('loaded.tab', () => {
    createMap();
  });

tabs();

