import {Observable} from '../node_modules/rxjs/bundles/rx.js';

export function loadFile(path) {
  return Observable.create(obs => {
    let client = new XMLHttpRequest();
    client.open('GET', path, true);
    client.onreadystatechange = () => {
      if (client.readyState == 4 && client.status == "200") {
        obs.next(client.responseText);
        obs.complete();
      }
      else if (client.status != "200") {
        obs.error();
      }
    };
    client.send(null);
  });
}