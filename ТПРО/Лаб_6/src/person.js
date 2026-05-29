class Person {
  constructor(name, email, age) {
    this.validateEmail(email);
    this.validateAge(age);
    this.name = name;
    this.email = email;
    this.age = age;
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) throw new Error('Неверный email');
  }

  validateAge(age) {
    if (age < 0 || age > 150) throw new Error('Возраст должен быть 0-150');
  }

  isAdult() {
    return this.age >= 18;
  }

  getDetails() {
    return `${this.name} (${this.age} лет) - ${this.email}`;
  }

  setName(newName) {
    if (!newName || newName.trim() === '') throw new Error('Имя не может быть пустым');
    this.name = newName;
  }
}

module.exports = Person;
