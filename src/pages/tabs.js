import anmerkungenHTML from './anmerkungen.html';
import karteHTML from './karte.html';
import homeHTML from './home.html';
import kontaktHTML from './kontakt.html';
import {createImageModalLinks} from "../imageModal";

export function tabs() {
  document.querySelector('#anmerkungen-tab').innerHTML = anmerkungenHTML;
  document.querySelector('#karte-tab').innerHTML = karteHTML;
  document.querySelector('#home-tab').innerHTML = homeHTML;
  document.querySelector('#kontakt-tab').innerHTML = kontaktHTML;

  createImageModalLinks(document.body);

  $('a[data-toggle="tab"]')
    .on('show.bs.tab', function () {
      let target = $(this).data('target');
      window.location.hash = target.slice(0, -4);
    });

  function showTab(target) {
    let $tab = $(`a[data-toggle="tab"][data-target="${target}"]`);
    if ($tab.length === 0) {
      $(`a[data-toggle="tab"][data-target="#home-tab"]`).tab('show');
    } else {
      $tab.tab('show');
    }
  }

  let hash = window.location.hash;

  if (hash === '') {
    showTab('#home-tab');
  } else {
    showTab(hash + '-tab');
  }
}
