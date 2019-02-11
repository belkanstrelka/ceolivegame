const uniqid = require('uniqid');
const moment = require('moment');
const _ = require('lodash');

const MarketingCampaign = require('./campaign')

class MarketingChannel {
  constructor(params = {}) {
    const {
      name,
      budget,
      today
    } = params;

    if (_.isNil(name)) {
      throw new Error(`name is not defined`);
    }

    if(_.isNil(today)) throw new Error(`today is not defined`);
    if(!moment.isMoment(today)) throw new Error(`today must be instanceof moment`);

    this.lastCalculatedDay = today.clone();

    this.id = uniqid();
    this.budget = budget || 0;

    this.name = name;
    this.campaigns = [];

    const defaultCampaign = this.createCampaign({
      cpa: 100,
      conv: 0.3
    })

    defaultCampaign.start()
  }

  calculateCampaignScores(scores = []) {
    var rv = {
      ua: 0,
      leads: 0,
      spent: 0
    }

    for (var i = 0; i < scores.length; i++) {
      const _score = scores[i];

      rv = {
        ua: rv.ua + _score.ua,
        leads: rv.leads + _score.leads,
        spent: rv.spent + _score.spent,
      }
    }

    return rv;
  }

  createCampaign(campaignParams) {
    if (_.isNil(campaignParams)) throw new Error(`campaignParams is not defined`);

    const campaign = new MarketingCampaign({
      dateCreated: this.lastCalculatedDay,
      ...campaignParams
    });

    this.campaigns.push(campaign)

    return campaign;
  }

  getDayScore(calendarDay) {
    if(_.isNil(calendarDay)) throw new Error(`calendarDay is not defined`);
    if(!moment.isMoment(calendarDay)) throw new Error(`calendarDay must be instanceof moment`);

    let dayScores = [];
    const daysDiff = calendarDay.diff(this.lastCalculatedDay, "days")

    for (var i = 0; i < daysDiff; i++) {
      _.each(this.campaigns, (campaign) => {
        let limit = (campaign.limit > this.budget)
          ? (campaign.limit - (campaign.limit - this.budget))
          : campaign.limit;

        dayScores.push(campaign.getDayScore({ limit }))
      });
    }

    this.lastCalculatedDay = calendarDay.clone()
    return this.calculateCampaignScores(dayScores);
  }

  addBudget(budget = 0) {
    if (!_.isNumber(budget)) throw new Error(`budget is not a number`);
    if (budget < 0) throw new Error(`budget must be positive`);

    this.budget += budget
  }

  getInfo() {
    console.log(`${this.name} channel info`);
    console.log(`  Balance: ${this.budget}$\t`);

    console.log(`  Campaigns - ${this.campaigns.length}`);
    for (var i = 0; i < this.campaigns.length; i++) {
      let c = this.campaigns[i];
      console.log(`    ${i}: ${c.name} campaign, limit: ${c.limit}$, ${c.isRunning ? 'Running' : 'Stopped'}`);
    }
    console.log(``);
  }
}

module.exports = MarketingChannel;
