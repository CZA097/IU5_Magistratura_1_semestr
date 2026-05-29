const { upperCase, lowerCase, stringReverse, palindromeCheck, capitalizeWord } = require('../src/text_helpers');

describe('Хелперы для текста', () => {
  describe('upperCase', () => {
    test('конвертирует в верхний регистр', () => {
      expect(upperCase('test')).toBe('TEST');
    });
    test('ошибка на не строку', () => {
      expect(() => upperCase(100)).toThrow('Аргумент должен быть строкой');
    });
  });

  describe('lowerCase', () => {
    test('конвертирует в нижний регистр', () => {
      expect(lowerCase('TEST')).toBe('test');
    });
  });

  describe('stringReverse', () => {
    test('переворачивает строку', () => {
      expect(stringReverse('abc')).toBe('cba');
    });
  });

  describe('palindromeCheck', () => {
    test('палиндром', () => {
      expect(palindromeCheck('Madam')).toBe(true);
    });

    test('не палиндром', () => {
      expect(palindromeCheck('Hello')).toBe(false);
    });
  });

  describe('capitalizeWord', () => {
    test('капитализация слова', () => {
      expect(capitalizeWord('hello')).toBe('Hello');
    });
  });
});
