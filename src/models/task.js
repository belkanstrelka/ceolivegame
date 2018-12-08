const uniqid = require('uniqid');

class Task {
  constructor(params = {}) {
    this.id = uniqid();
  }
}

module.exports = Task;
