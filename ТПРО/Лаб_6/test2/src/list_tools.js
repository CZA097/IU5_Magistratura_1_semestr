function maxElement(arr) {
  if (!Array.isArray(arr) || arr.length === 0) throw new Error('Нужен непустой массив');
  return Math.max(...arr);
}

function minElement(arr) {
  if (!Array.isArray(arr) || arr.length === 0) throw new Error('Нужен непустой массив');
  return Math.min(...arr);
}

function sumElements(arr) {
  if (!Array.isArray(arr)) throw new Error('Нужен массив');
  return arr.reduce((acc, n) => acc + n, 0);
}

function averageElements(arr) {
  if (!Array.isArray(arr)) throw new Error('Нужен массив');
  if (arr.length === 0) return 0;
  return sumElements(arr) / arr.length;
}

function uniqueItems(arr) {
  if (!Array.isArray(arr)) throw new Error('Нужен массив');
  return [...new Set(arr)];
}

function evenItems(arr) {
  if (!Array.isArray(arr)) throw new Error('Нужен массив');
  return arr.filter(n => n % 2 === 0);
}

module.exports = { maxElement, minElement, sumElements, averageElements, uniqueItems, evenItems };
