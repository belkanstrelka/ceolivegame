const uniqid = require('uniqid');

class Skills {
  constructor(params = {}) {
    this.id = uniqid();
  }
}

module.exports = Skills;
