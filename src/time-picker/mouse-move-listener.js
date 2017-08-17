export function mouseMoveListener(element) {
  let clickTolerance = 200;

  let moveStartListener = [];
  let moveListener = [];
  let moveEndListener = [];
  let clickListener = [];

  let mouseDown;
  let mouseDownTime;
  let startX;

  element.addEventListener('mousedown', e => {
    mouseDown = true;
    startX = e.screenX;
    mouseDownTime = Date.now();
    // console.log('down: ' + mouseDownTime);
    e.preventDefault();
    e.stopImmediatePropagation();
    for (let listener of moveStartListener) {
      listener(e);
    }
  });

  document.addEventListener('mousemove', e => {
    // console.log('move: ' + Date.now());
    if (mouseDown && (Date.now() - mouseDownTime) > clickTolerance) {
      e.diffX = e.screenX - startX;
      for (let listener of moveListener) {
        listener(e);
      }
    }
  });

  document.addEventListener('mouseup', e => {
    // console.log('up: ' + Date.now());
    if (mouseDown && (Date.now() - mouseDownTime) <= clickTolerance) {
      for (let listener of clickListener) {
        listener(e);
      }
    }
    mouseDown = false;
    for (let listener of moveEndListener) {
      listener(e);
    }
  });

  let returnObj = {
    onMoveStart: fn => {
      moveStartListener.push(fn);
      return returnObj;
    },
    onMove: fn => {
      moveListener.push(fn);
      return returnObj;
    },
    onMoveEnd: fn => {
      moveEndListener.push(fn);
      return returnObj;
    },
    onClick: fn => {
      clickListener.push(fn);
      return returnObj;
    }
  }

  return returnObj;
}