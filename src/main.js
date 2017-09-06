import {createMap} from './map';
import {tabs} from './pages/tabs';

import './design.css';

$('a[data-toggle="tab"][data-target="#karte-tab"]')
  .one('show.bs.tab', () => {
    createMap();
  });

tabs();

