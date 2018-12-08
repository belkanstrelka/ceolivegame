const uniqid = require('uniqid');

class Idea {
  constructor(params = {}) {
    this.id = uniqid();
  }
}

module.exports = Idea;
