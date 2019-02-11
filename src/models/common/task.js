const uniqid = require('uniqid');
const Skills = require('./skills');
const SkillRatioBalancer = require('./../utils/skillRatioBalancer');

const skillRatioBalancer = new SkillRatioBalancer()

class Task {
  constructor(params = {}) {
    const {
      // requiredSkills,
      // avgBusinessImprovements,
      // avgTime,
      id,
      taskType,
      parent,
      name,
      skills,
      hours,
      cost
    } = params;

    this.id = id
    this.taskType = taskType
    this.parent = parent
    this.name = name
    this.skills = new Skills(skills)
    this.hours = hours
    this.cost = cost

    this.execTime = 0
    // dateCreated
    // realTime
    // execTime
  }

  setExecutor(executor) {
    this.executor = executor;
    this.setRealTime()
  }

  setRealTime() {
    if (!this.executor) throw new Error(`executor is not defined`);

    const skillRatio = skillRatioBalancer.getSkillRatio(this.executor.skills, this.skills)
    this.realTime = this.hours * skillRatio
  }

  progress() {
    return this.execTime + ' / ' + this.realTime
  }

  resolve(timeToExecute) {
    if (!this.executor) throw new Error(`executor is not defined`);

    let availableHours = 0;
    let remainHoursToExecute = this.realTime - (this.execTime + timeToExecute);

    if (remainHoursToExecute > 0) {
      this.execTime += timeToExecute
    } else {
      availableHours = remainHoursToExecute * -1;
      this.execTime = this.realTime
      this.status = 'resolved'
    }

    return availableHours
  }
}

module.exports = Task;
