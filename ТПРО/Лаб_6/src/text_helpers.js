function upperCase(str) {
  if (typeof str !== 'string') throw new Error('Аргумент должен быть строкой');
  return str.toUpperCase();
}

function lowerCase(str) {
  if (typeof str !== 'string') throw new Error('Аргумент должен быть строкой');
  return str.toLowerCase();
}

function stringReverse(str) {
  if (typeof str !== 'string') throw new Error('Аргумент должен быть строкой');
  return str.split('').reverse().join('');
}

function palindromeCheck(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === stringReverse(cleaned);
}

function capitalizeWord(str) {
  if (typeof str !== 'string') throw new Error('Аргумент должен быть строкой');
  if (str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = { upperCase, lowerCase, stringReverse, palindromeCheck, capitalizeWord };
