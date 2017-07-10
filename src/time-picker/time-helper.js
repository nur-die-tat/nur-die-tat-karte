
export function monthDiff(d1, d2) {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export function addMonths(d1, months) {
  let date = new Date(d1);
  let m = date.getMonth() + months;

  date.setYear(date.getYear() + Math.floor(m / 12));
  date.setMonth(m % 12);
  return date;
}