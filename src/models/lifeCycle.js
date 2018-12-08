const _ = require('lodash');
const { sleep } = require('./../utils');

const INTERVAL_TIME = 1000;

const _notifySubscribers = function(lifeCycle) {
  if (_.isNil(lifeCycle)) throw new Error(`lifeCycle is not defined`);
  let { _tickHandlers } = lifeCycle;

  for (let i = 0; i < _tickHandlers.length; i++) {
    _tickHandlers[i](lifeCycle)
  }
}

class LifeCycle {
  constructor(params = {}) {
    var { founder, company } = params;

    if (_.isNil(founder)) {
      throw new Error("founder is required param");
    }
    if (_.isNil(company)) {
      throw new Error("company is required param");
    }

    this._intervalTime = INTERVAL_TIME;
    this._tickHandlers = [];
    this._status = 'ready';

    this.company = company;
    this.founder = founder;
  }

  async start() {
    var self = this;
    if (this._status !== 'ready') {
      throw new Error(`start for status '${this._status}' is not available, must be 'ready'`);
    }

    this._status = 'started';
    while (self._status === 'started') {
      await self.tick();
      await sleep(self._intervalTime);
    }
  }

  stop() {
    if (this._status !== 'started') {
      throw new Error(`stop for status '${this.status}' is not available, must be 'started'`);
    }

    this._status = 'ready';
  }

  async tick() {
    // что происходит в процессе хода
    // founder генерит задачки
    // founder выбирает какие задачки решить

    // Команда проекта решать задачки
      // в команде могут быть как внешние чуваки (фрилансеры) так и штатные (founder)

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

module.exports = LifeCycle;
