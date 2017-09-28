export function panelHide(map) {
  let leftPanel = document.querySelector('#left-panel');
  let hideButton = document.querySelector('#left-panel-hide-button');
  let showButton = document.querySelector('#left-panel-show-button');

  hideButton.addEventListener('click', () => {
    hideButton.classList.add('hidden');
    showButton.classList.remove('hidden');
    leftPanel.classList.add('hidden');
    map.updateSize();
  });

  showButton.addEventListener('click', () => {
    hideButton.classList.remove('hidden');
    showButton.classList.add('hidden');
    leftPanel.classList.remove('hidden');
    map.updateSize();
  });
}