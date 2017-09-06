import {createMap} from './map';
import {tabs} from './tabs';

import './design.css';

$('a[data-toggle="tab"][data-target="#karte-tab"]')
  .one('loaded.tab', () => {
    createMap();
  });

tabs();

