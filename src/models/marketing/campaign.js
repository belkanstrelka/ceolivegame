// const MarketingChannel = require('./channel');
// const CashGate = require('./cashGate');
const uniqid = require('uniqid');
const moment = require('moment');
const _ = require('lodash');

class MarketingCampaign {
  constructor(params = {}) {
    const {
      name,
      dateCreated,
      cashGate,
      channel,
      cpa,
      conv,
      limit
    } = params;

    if(_.isNil(dateCreated)) throw new Error(`dateCreated is not defined`);
    if(!moment.isMoment(dateCreated)) throw new Error(`dateCreated must be instanceof moment`);

    // if(_.isNil(cashGate)) throw new Error(`cashGate is not defined`);
    // if(!(cashGate instanceof CashGate)) throw new Error(`cashGate must be instanceof CashGate`);
    //
    // if(_.isNil(channel)) throw new Error(`channel is not defined`);
    // if(!(channel instanceof MarketingChannel)) throw new Error(`channel must be instanceof MarketingChannel`);

    if(_.isNil(cpa)) throw new Error(`cpa is not defined`);
    if(!_.isNumber(cpa)) throw new Error(`cpa must be a number`);

    if(_.isNil(conv)) throw new Error(`conv is not defined`);
    if(!_.isNumber(conv)) throw new Error(`conv must be a number`);

    if(limit && !_.isNumber(limit)) throw new Error(`limit is not defined`);

    this.name = name || uniqid('campaign-');
    this.dateCreated = dateCreated.clone();
    this.isRunning = false;

    this.cpa = cpa;
    this.conv = conv;
    this.limit = limit || 150;

    this.historical = {
      ua: 0,
      leads: 0,
      spent: 0,
    }
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }

  getDayScore(params = {}) {
    const { limit } = params;
    const moneySpent = _.isNumber(limit) ? limit : this.limit;

    this.historical.spent += moneySpent;

    const alreadyUaInCampaign = this.historical.ua;
    const uaInCampaign = Math.round(this.historical.spent / this.cpa);
    this.historical.ua = uaInCampaign;

    //считать лиди по историческим данным
    const alreadyLeadsInCampaign = this.historical.leads;
    const leadsInCampaign = Math.round(this.historical.ua * this.conv);
    this.historical.leads = leadsInCampaign;

    return {
      ua: uaInCampaign - alreadyUaInCampaign,
      leads: leadsInCampaign - alreadyLeadsInCampaign,
      spent: moneySpent,
    }
  }
}

module.exports = MarketingCampaign;
