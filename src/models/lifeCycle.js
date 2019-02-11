const _ = require('lodash');
const { sleep } = require('./../../utils');

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
    var { founder, business } = params;

    if (_.isNil(founder)) {
      throw new Error("founder is required param");
    }
    if (_.isNil(business)) {
      throw new Error("business is required param");
    }

    this._intervalTime = INTERVAL_TIME;
    this._tickHandlers = [];
    this._status = 'ready';

    this.business = business;
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

  resolveTask(business.SelectedTasks) {
    // AvaliableStories, Skills += ОбщениеTask.resolve()
    // BusinesImprovments += ОстальныыеTask.resolve()
  }

  getSelectedTasks() {
    return []
    // return [reccurent + selected]
  }

  balanceBurn() {
    // business.balance -= (UE.cost() + business.fixcost() + selectedTask.cost)
  }

  update() {
    // business.balance -= (UE.cost() + business.fixcost() + selectedTask.cost)
  }

  async tick(newSelected) {
    const { business, founder } = this;

    // new BusinessDay()
    business.addTasksToExecute(newSelected);

    // один sprint
    business._burn();
    const resolvedTask = business._resolveTasks();
    business._update(resolvedTask);

    business.businessIdea.backlog += businessIdea.generateIdea(
      business.team.skills()
    )

    founder.stories.add(
      StoryProvider.generateStory(founder)
    )

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
