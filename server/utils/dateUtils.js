function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value))
    && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function nightsBetween(fromdate, todate) {
  const start = new Date(`${fromdate}T00:00:00Z`);
  const end = new Date(`${todate}T00:00:00Z`);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

function datesOverlap(fromA, toA, fromB, toB) {
  return new Date(`${fromA}T00:00:00Z`) < new Date(`${toB}T00:00:00Z`)
    && new Date(`${fromB}T00:00:00Z`) < new Date(`${toA}T00:00:00Z`);
}

module.exports = { isDate, nightsBetween, datesOverlap };
