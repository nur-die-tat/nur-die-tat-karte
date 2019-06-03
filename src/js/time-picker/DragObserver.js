import Observable from 'ol/Observable'

export class DragObserver extends Observable {
  constructor (element) {
    super()

    let clickTolerance = 200
    let mouseDown
    let mouseDownTime
    let startX

    element.addEventListener('mousedown', e => {
      mouseDown = true
      startX = e.screenX
      mouseDownTime = Date.now()
      // console.log('down: ' + mouseDownTime);
      e.preventDefault()
      e.stopImmediatePropagation()
      this.dispatchEvent({
        type: 'moveStart',
        originalEvent: e
      })
    })

    document.addEventListener('mousemove', e => {
      // console.log('move: ' + Date.now());
      if (mouseDown && (Date.now() - mouseDownTime) > clickTolerance) {
        e.diffX = e.screenX - startX
        this.dispatchEvent({
          type: 'move',
          originalEvent: e
        })
      }
    })

    document.addEventListener('mouseup', e => {
      // console.log('up: ' + Date.now());
      if (mouseDown && (Date.now() - mouseDownTime) <= clickTolerance) {
        this.dispatchEvent({
          type: 'click',
          originalEvent: e
        })
      }
      mouseDown = false
      this.dispatchEvent({
        type: 'moveEnd',
        originalEvent: e
      })
    })
  }
}
