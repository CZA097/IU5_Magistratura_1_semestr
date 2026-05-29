class MathUtils {
  power(base, exponent) {
    if (exponent < 0) throw new Error('Показатель степени должен быть положительным');
    return Math.pow(base, exponent);
  }

  factorial(n) {
    if (n < 0) throw new Error('Факториал не определен для отрицательных чисел');
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  }

  isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  }

  gcd(a, b) {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  roundTo(value, digits) {
    if (digits < 0) throw new Error('Количество знаков не может быть отрицательным');
    return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
  }
}

module.exports = MathUtils;