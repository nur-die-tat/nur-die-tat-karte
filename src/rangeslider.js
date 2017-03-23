import {Subject} from '../node_modules/rxjs/bundles/rx.js';

function monthDiff(d1, d2) {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

function addMonths(d1, months) {
  let date = new Date(d1);
  let m = date.getMonth() + months;

  date.setYear(date.getYear() + Math.floor(m / 12));
  date.setMonth(m % 12);
  return date;
}

export class RangeSlider {
  constructor(target, begin, end, gridSize) {
    this.begin = begin;
    this.end = end;
    this.gridSize = gridSize;

    this.beginSubject = new Subject();
    this.endSubject = new Subject();

    this.diff = monthDiff(begin, end);

    this.element = document.createElement('div');
    this.element.classList.add('rangeslider');
    target.appendChild(this.element);

    this.rangeBackground = document.createElement('div');
    this.rangeBackground.classList.add('rangeslider-range-background');
    this.element.appendChild(this.rangeBackground);

    this.stepSize = this.rangeBackground.clientWidth / this.diff;

    // this.rangeBackground.style['background-image'] = `repeating-linear-gradient(90deg, transparent, transparent ${this.stepSize - 1}px, black  ${this.stepSize - 1}px, black  ${this.stepSize}px)`;

    this.leftKnob = document.createElement('img');
    this.leftKnob.classList.add('rangeslider-range-knob');
    this.leftKnob.src = '../images/knob.png';
    this.rangeBackground.appendChild(this.leftKnob);

    this.rightKnob = document.createElement('img');
    this.rightKnob.classList.add('rangeslider-range-knob');
    this.rightKnob.src = '../images/knob.png';
    this.rangeBackground.appendChild(this.rightKnob);

    this.betweenKnobs = document.createElement('div');
    this.betweenKnobs.classList.add('rangeslider-range-between-knobs');
    this.rangeBackground.appendChild(this.betweenKnobs);

    this.setLeft(0);
    this.setRight(1);
    this.attachLeftKnobListeners();
    this.attachRightKnobListeners();
    this.attachBetweenKnobListeners();

    this.createLineMarkers();
    this.createNumberMarkers();

    window.addEventListener('resize', () => {
      this.stepSize = this.rangeBackground.clientWidth / this.diff;
      //this.rangeBackground.style['background-image'] = `repeating-linear-gradient(90deg, transparent, transparent ${this.stepSize - 1}px, black  ${this.stepSize - 1}px, black  ${this.stepSize}px)`;
      this.setLeft(this.leftStep);
      this.setRight(this.rightStep);
      this.createNumberMarkers();
      this.createLineMarkers();
    });
  }

  createLineMarkers() {
    if (this.lineMarkerContainer) {
      this.rangeBackground.removeChild(this.lineMarkerContainer);
    }
    this.lineMarkerContainer = document.createElement('ul');
    this.lineMarkerContainer.classList.add('rangeslider-ruler');
    this.rangeBackground.appendChild(this.lineMarkerContainer);
    for (let i = 1; i < this.diff; i++) {
      let li = document.createElement('li');
      li.style['left'] = i * this.stepSize - 1 + 'px';
      this.lineMarkerContainer.appendChild(li);
    }
  }

  setLeft(step) {
    step = (step < 0) ? 0 : step;
    step = (step >= this.rightStep) ? this.rightStep - 1 : step;
    this.leftStep = step;
    this.leftKnob.style.left = step * this.stepSize + 'px';
    this.adjustBetweenKnobs();
    this.beginSubject.next(addMonths(this.begin, step));
  }

  setRight(step) {
    step = (step <= this.leftStep) ? this.leftStep + 1 : step;
    step = (step > this.diff) ? this.diff : step;
    this.rightStep = step;
    this.rightKnob.style.left = this.rightStep * this.stepSize + 'px';
    this.adjustBetweenKnobs();
    this.endSubject.next(addMonths(this.begin, step));
  }

  adjustBetweenKnobs() {
    this.betweenKnobs.style.left = this.leftStep * this.stepSize + 'px';
    this.betweenKnobs.style.right = this.rangeBackground.clientWidth - this.rightStep * this.stepSize + 'px';
  }

  getBegin() {
    return this.beginSubject.asObservable();
  }

  getEnd() {
    return this.endSubject.asObservable();
  }

  attachLeftKnobListeners() {
    let mouseDown = false;

    let startStep;
    let startX;

    this.leftKnob.addEventListener('mousedown', e => {
      startStep = this.leftStep;
      startX = e.screenX;
      mouseDown = true;
      e.stopImmediatePropagation();
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (mouseDown) {
        let x = e.screenX - startX;
        this.setLeft(startStep + Math.round(x / this.stepSize));
      }
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });
  }

  attachRightKnobListeners() {
    let mouseDown = false;

    let startStep;
    let startX;

    this.rightKnob.addEventListener('mousedown', e => {
      startStep = this.rightStep;
      startX = e.screenX;
      mouseDown = true;
      e.stopImmediatePropagation();
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (mouseDown) {
        let x = e.screenX - startX;
        this.setRight(startStep + Math.round(x / this.stepSize));
      }
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });
  }

  attachBetweenKnobListeners() {
    let mouseDown = false;

    let startLeft;
    let startRight;
    let startX;

    this.betweenKnobs.addEventListener('mousedown', e => {
      mouseDown = true;
      startLeft = this.leftStep;
      startRight = this.rightStep;
      startX = e.screenX;
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (mouseDown) {
        let x = e.screenX - startX;
        let move = Math.round(x / this.stepSize);
        this.setLeft(startLeft + move);
        this.setRight(startRight + move);
      }
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });
  }

  createNumberMarkers() {
    if (this.markerContainer) {
      this.element.removeChild(this.markerContainer);
    }
    this.markerContainer = document.createElement('div');
    this.element.appendChild(this.markerContainer);
    this.markerContainer.classList.add('rangeslider-yearmarker-container');

    let date = new Date(this.begin);
    let steps = 0;
    let lastLeft = -Infinity;

    while (date <= this.end) {
      if (date.getMonth() === 0) {
        let yearNode = document.createElement('div');
        this.markerContainer.appendChild(yearNode);
        yearNode.classList.add('rangeslider-yearmarker');
        yearNode.textContent = date.getFullYear();

        let newLeft = steps * this.stepSize - yearNode.offsetWidth / 2;

        if (newLeft - lastLeft > yearNode.offsetWidth) {
          yearNode.style.left = newLeft + 'px';
          lastLeft = newLeft;
        }
        else {
          this.markerContainer.removeChild(yearNode);
        }
      }

      steps++;
      date.setMonth(date.getMonth() + this.gridSize);
    }
  }
}
