const Person = require('../src/person');

describe('Класс Person', () => {
  test('Корректный конструктор', () => {
    const p = new Person('Анна', 'anna@example.com', 30);
    expect(p.name).toBe('Анна');
    expect(p.email).toBe('anna@example.com');
    expect(p.age).toBe(30);
  });

  test('Некорректный email выбрасывает ошибку', () => {
    expect(() => new Person('Иван', 'ivanexample.com', 25)).toThrow('Неверный email');
  });

  test('Возраст вне диапазона выбрасывает ошибку', () => {
    expect(() => new Person('Петр', 'petr@example.com', -1)).toThrow('Возраст должен быть 0-150');
  });

  test('Метод isAdult для 20 лет', () => {
    const p = new Person('Сергей', 'sergey@example.com', 20);
    expect(p.isAdult()).toBe(true);
  });

  test('setName меняет имя', () => {
    const p = new Person('Ольга', 'olga@example.com', 40);
    p.setName('Оля');
    expect(p.name).toBe('Оля');
  });

  test('setName пустое имя выбрасывает ошибку', () => {
    const p = new Person('Маша', 'masha@example.com', 22);
    expect(() => p.setName('  ')).toThrow('Имя не может быть пустым');
  });
});
