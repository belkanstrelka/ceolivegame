const uniqid = require('uniqid');

class Person {
  constructor(params = {}) {
    const { skills } = params;
    this.id = uniqid();
  }
}

module.exports = Person;
