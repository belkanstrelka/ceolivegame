const _ = require('lodash');

class Company {
  constructor(params = {}) {
    const {
      calendar,
      team,
      cashGates,
      balance,
      backlog,
      taskProvider,
      businessIdea
    } = params;

    this.tasks = {
      executed: [],
      executing: [],
      backlog: []
    };

    this.team = team;
    this.cashGates = cashGates || [];
    this.businessIdea = businessIdea;
    this.taskProvider = taskProvider;
    this.balance = balance;

    this.calendar = calendar;

    this.calendar.addTickHandler(
      this.calendarHandler.bind(this)
    )
  }

  _getUECost() {
    // это сумма всех кампаний + продление подписок
    return 0;
  }

  _getFixCost() {
    let fixCost = 0;

    for (var i = 0; i < this.team.length; i++) {
      fixCost += this.team[i].getSalary();
    }

    return fixCost;
  }

  _getSelectedTasksCost() {
    // это сумма выбранных задач на испольнение, считать их только один раз?
    return 0;
  }

  markAsExecuted(taskIds) {
    this.tasks.executed = [
      ...this.tasks.executed,
      ..._.filter(
        this.tasks.executing,
        (task) => _.intersection(taskIds, [task.id]).length > 0
      )
    ]

    this.tasks.executing = _.filter(
      this.tasks.executing,
      (task) => _.intersection(taskIds, [task.id]).length === 0
    )
  }

  selectTasks(taskIds) {
    this.tasks.executing = [
      ...this.tasks.executing,
      ..._.filter(
        this.tasks.backlog,
        (task) => _.intersection(taskIds, [task.id]).length > 0
      )
    ]

    this.tasks.backlog = _.filter(
      this.tasks.backlog,
      (task) => _.intersection(taskIds, [task.id]).length === 0
    )
  }

  calendarHandler(calendar) {
    // console.log('company: ' + calendar.today.format('DD.MM.YYYY'));
    let availableHours = 5;

    const dayBurnBalance = this._getUECost() + this._getFixCost() + this._getSelectedTasksCost();
    this.balance -= dayBurnBalance

    _.each(this.tasks.executing, (task) => {
      if (availableHours > 0) {
        availableHours = task.resolve(availableHours)

        if (task.status === 'resolved') {
          this.markAsExecuted([task.id])
        }
      }
    })
    // const resolvedTask = business._resolveTasks();
    // business._update(resolvedTask);
    this.tasks = this.taskProvider.getTasks(this.tasks);
    for (var i = 0; i < this.tasks.backlog.length; i++) {
      const t = this.tasks.backlog[i];

      if (!t.executor) {
        t.setExecutor(this.team[0])
      }
    }

    // founder.stories.add(
    //   StoryProvider.generateStory(founder)
    // )

    // Ходим по CashGates, - у них есть подписчики
    //  -> они приносят UA
    //  -> и с вероятностью канала дают новых подписчиков
    //  -> новые подписчики платят деньги

    // Проверяем все старых подписчиков
    //  -> они отваливаются с вероятностью productMarketFit * N
    //  -> которые остаются, платят подписку
  }

  earnToday () {
    return 0;
  }

  subscr () {
    return 0;
  }

  logInfo () {
    console.log(`Business Info`);
    console.log(`  Balance: ${this.balance}$\tMoneyEarn: ${this.earnToday()}$\tSubscr: ${this.subscr()}`);

    console.log(`  Executed (${this.tasks.executed.length} tasks)`);
    for (var i = 0; i < this.tasks.executed.length; i++) {
      let t = this.tasks.executed[i];
      console.log(`    ${i}: ${t.name}`);
    }

    console.log(`  Executing (${this.tasks.executing.length} tasks)`);
    for (var i = 0; i < this.tasks.executing.length; i++) {
      let t = this.tasks.executing[i];
      console.log(`    ${i}: ${t.progress()} - ${t.name}`);
    }

    console.log(`  Backlog (${this.tasks.backlog.length} tasks)`);
    for (var i = 0; i < this.tasks.backlog.length; i++) {
      let t = this.tasks.backlog[i];
      console.log(`    ${i}: ${t.progress()} - ${t.name}`);
    }

    console.log(`#######################################`);
  }
}

module.exports = Company;
