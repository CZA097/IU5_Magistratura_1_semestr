const { maxElement, minElement, sumElements, averageElements, uniqueItems, evenItems } = require('../src/list_tools');

describe('Инструменты для списков', () => {
  test('находит max', () => {
    expect(maxElement([1, 5, 10])).toBe(10);
  });

  test('находит min', () => {
    expect(minElement([1, 5, 10])).toBe(1);
  });

  test('суммирует', () => {
    expect(sumElements([1, 2, 3])).toBe(6);
  });

  test('среднее', () => {
    expect(averageElements([2, 4, 6])).toBe(4);
  });

  test('уникальные элементы', () => {
    expect(uniqueItems([1, 1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  test('четные элементы', () => {
    expect(evenItems([1, 2, 3, 4, 5])).toEqual([2, 4]);
  });
});
