const MathUtils = require('../src/math_utils');

describe('Математические утилиты', () => {
  let math;

  beforeEach(() => {
    math = new MathUtils();
  });

  describe('Функция power', () => {
    test('2^3 равно 8', () => {
      expect(math.power(2, 3)).toBe(8);
    });

    test('5^2 равно 25', () => {
      expect(math.power(5, 2)).toBe(25);
    });

    test('0^0 равно 1', () => {
      expect(math.power(0, 0)).toBe(1);
    });

    test('отрицательный показатель выбрасывает ошибку', () => {
      expect(() => math.power(2, -1)).toThrow('Показатель степени должен быть положительным');
    });
  });

  describe('Функция factorial', () => {
    test('5! = 120', () => {
      expect(math.factorial(5)).toBe(120);
    });

    test('0! = 1', () => {
      expect(math.factorial(0)).toBe(1);
    });

    test('отрицательное число выбрасывает ошибку', () => {
      expect(() => math.factorial(-5)).toThrow('Факториал не определен для отрицательных чисел');
    });
  });

  describe('Функция isPrime', () => {
    test('17 - простое число', () => {
      expect(math.isPrime(17)).toBe(true);
    });

    test('15 - не простое число', () => {
      expect(math.isPrime(15)).toBe(false);
    });
  });

  describe('Функция gcd', () => {
    test('НОД(48, 18) = 6', () => {
      expect(math.gcd(48, 18)).toBe(6);
    });
  });

  describe('Функция roundTo', () => {
    test('округление до 2 знаков: 3.14159 -> 3.14', () => {
      expect(math.roundTo(3.14159, 2)).toBe(3.14);
    });

    test('отрицательное количество знаков выбрасывает ошибку', () => {
      expect(() => math.roundTo(3.14, -1)).toThrow('Количество знаков не может быть отрицательным');
    });
  });
});
