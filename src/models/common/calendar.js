const _ = require('lodash');
const moment = require('moment');

moment.locale('ru');

const _notifySubscribers = function(calendar) {
  if (_.isNil(calendar)) throw new Error(`calendar is not defined`);
  let { _tickHandlers } = calendar;

  for (let i = 0; i < _tickHandlers.length; i++) {
    _tickHandlers[i](calendar)
  }
}

class Calendar {
  constructor(params = {}) {
    const { today } = params;

    this._tickHandlers = [];
    this.initDate = today

    this.today = today
      ? moment(today, 'DD.MM.YYYY')
      : moment()
  }

  simulateDay(daysCount = 1) {
    this.today = this.today.add(daysCount, 'days')

    _notifySubscribers(this);
  }

  addTickHandler(handler) {
    if (!_.isFunction(handler)) {
      throw new Error("handler must be a function");
    }

    this._tickHandlers.push(handler);
  }

  removeTickHandler(handler) {
    this._tickHandlers = _.filter(this._tickHandlers, (_handler) => _handler !== handler);
  }
}

module.exports = Calendar;
