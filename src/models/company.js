const uniqid = require('uniqid');

class Company {
  constructor(params = {}) {
    this.id = uniqid();
  }
}

module.exports = Company;
