const uniqid = require('uniqid');

// OneTimeUA,
// MaxRecurringUA,
// MaxValueGrowth,
// AvgP,
// COGS,
// CPA

class UnitEconomics {
  constructor(params = {}) {
    this.ua = 0;
    this.c1 = 0;
    this.apc = 0;
    this.avPrice = 0;
    this.cogs = 0;
    this.oneTimeCogs = 0;
    this.cpa = 0;
  }
}

module.exports = UnitEconomics;
