import {RangeSlider} from "./rangeslider.js";

function formatDate(date) {
  let m = date.getMonth()+1;
  let d = date.getDate();
  return `${date.getFullYear()}-${(m < 10)? '0' + m: m}-${(d < 10)? '0' + d: d}`;
}

export function timePicker(layers) {
  let beginElement = document.querySelector('#begin-picker');
  let endElement = document.querySelector('#end-picker');

  let begin = new Date('1918-01-01');
  let end = new Date('1935-01-01');

  beginElement.value = formatDate(begin);
  endElement.value = formatDate(end);

  let r = new RangeSlider(document.querySelector('#footer'), begin, end, 1);

  r.getBegin().subscribe(b => {
    begin = b;
    beginElement.value = formatDate(b);
    adjust(layers, begin, end);
  });

  r.getEnd().subscribe(e => {
    end = e;
    endElement.value = formatDate(e);
    adjust(layers, begin, end);
  });
}

function adjust(layers, begin, end) {
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
