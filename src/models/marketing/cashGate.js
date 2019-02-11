const uniqid = require('uniqid');
const _ = require('lodash');

const MarketingChannel = require('./channel')

class CashGate {
  constructor(params = {}) {
    const { name } = params;

    if (_.isNil(name)) {
      throw new Error(`name is not defined`);
    }

    this.id = uniqid();
    this.name = name;
    this.channels = [];
  }

  addChannel(channel) {
    if (!(channel && channel instanceof MarketingChannel))
      throw new Error(`channel is not instanceof of MarketingChannel`)

    this.channels.push(channel)
  }
}

module.exports = CashGate;
