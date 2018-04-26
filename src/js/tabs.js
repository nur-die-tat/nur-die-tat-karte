import anmerkungenUrl from 'file-loader?name=pages/[name].[ext]!../html/anmerkungen.html';
import karteUrl from 'file-loader?name=pages/[name].[ext]!../html/karte.html';
import homeUrl from 'file-loader?name=pages/[name].[ext]!../html/home.html';
import kontaktUrl from 'file-loader?name=pages/[name].[ext]!../html/kontakt.html';
import {createImageModalLinks} from "./imageModal";
import {loadHTML} from "./loadHTML";

export function tabs() {
  let urls = {
    '#anmerkungen-tab': anmerkungenUrl,
    '#karte-tab': karteUrl,
    '#home-tab': homeUrl,
    '#kontakt-tab': kontaktUrl
  };

  createImageModalLinks(document.body);

  $('a[data-toggle="tab"]')
    .on('show.bs.tab', function () {
      let target = $(this).data('target');
      window.location.hash = target.slice(0, -4);
      loadHTML(target, urls[target])
        .then(() => $(this).trigger('loaded.tab'));
    })
    .on('shown.bs.tab', function () {
      window.scrollTo(0,0);
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

export function createTabLinks(target) {
  for (let tabLink of target.querySelectorAll('a')) {
    let href = tabLink.getAttribute('href');
    if (href[0] == '#' && href.length > 1) {
      tabLink.addEventListener('click', e => {
        let $tab = $(`a[data-toggle="tab"][data-target="${href}-tab"]`);
        if ($tab.length === 0) {
          $(`a[data-toggle="tab"][data-target="#home-tab"]`).tab('show');
        } else {
          $tab.tab('show');
        }
      });
    }
  }
}
