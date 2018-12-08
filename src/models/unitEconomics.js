const uniqid = require('uniqid');

// OneTimeUA,
// MaxRecurringUA,
// MaxValueGrowth,
// AvgP,
// COGS,
// CPA
class UnitEconomics {
  constructor(params = {}) {
    this.id = uniqid();
  }
}

module.exports = UnitEconomics;
