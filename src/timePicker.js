import {RangeSlider} from "./rangeslider.js";

export class TimePicker {
  constructor(layers) {
    // let beginElement = document.querySelector('#begin-picker');
    // let endElement = document.querySelector('#end-picker');

    let begin = new Date('1918-01-01');
    let end = new Date('1937-01-01');

    // beginElement.value = this.formatDate(begin);
    // endElement.value = this.formatDate(end);

    this.rangeSlider = new RangeSlider(document.querySelector('#footer'), begin, end, 1);

    this.rangeSlider.getBegin().subscribe(b => {
      begin = b;
      // beginElement.value = this.formatDate(b);
      this.adjust(layers, begin, end);
    });

    this.rangeSlider.getEnd().subscribe(e => {
      end = e;
      // endElement.value = this.formatDate(e);
      this.adjust(layers, begin, end);
    });
  }

  formatDate(date) {
    let m = date.getMonth()+1;
    let d = date.getDate();
    return `${date.getFullYear()}-${(m < 10)? '0' + m: m}-${(d < 10)? '0' + d: d}`;
  }

  adjust(layers, begin, end) {
    for (let l of layers) {
      for (let f of l.getSource().getFeatures()) {
        let fBegin = new Date(f.get('begin'));
        let fEnd = new Date(f.get('end'));
        if ((fBegin >= begin && fBegin <= end) || (fEnd >= begin && fEnd <= end)) {
          f.set('hidden', false);
        }
        else {
          f.set('hidden', true);
        }
      }
    }
  }

  update() {
    this.rangeSlider.update();
  }
}