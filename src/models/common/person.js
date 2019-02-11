const uniqid = require('uniqid');

class Person {
  constructor(params = {}) {
    const { skills, salary } = params;

    this.skills = skills;
    this._salary = salary;
  }

  getSalary() {
    return this._salary;
  }

  improveSkills(skillsImprovents) {
    this.skills.improve(skillsImprovents)
  }
}

module.exports = Person;
