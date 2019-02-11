const _ = require('lodash');
const ChapterTaskTree = require('./chapterTaskTree');
const Task = require('./../models/common/task');

// есть задачи связанные с идеей, есть общие задачи

// productImprovement
// marketing
// networking
// legal
// team
// management

class TaskProvider {
  constructor(params = { }) {
    const { chapterTaskTree } = params;

    if (_.isNil(chapterTaskTree))
      throw new Error(`chapterTaskTree is not defined`)

    if (!(chapterTaskTree instanceof ChapterTaskTree))
      throw new Error(`chapterTaskTree is not instanceof of ChapterTaskTree`)

    this.chapterTaskTree = chapterTaskTree;
  }

  _getTasksToAdd (chapterTaskTree, executed, backlog) {
    let _executed = executed.map(t => t.id);

    let addTasks = _.filter(chapterTaskTree.tasks, function (taskCreator) {
      var parentTaskArr = _.isArray(taskCreator.parent)
        ? taskCreator.parent
        : [taskCreator.parent]

      return _.intersection(_executed, parentTaskArr).length;
    })

    return _.map(
      _.differenceBy(addTasks, backlog, (v) => v.id || v),
      (taskCreator) => {
        return new Task(taskCreator)
      }
    );
  }

  _getTasksToRemove (addTasks, executed, backlog) {
    let self = this;
    let removeTasks = [];
    let _backlog = backlog.map(t => t.id);
    let _executed = executed.map(t => t.id);

    _.each(addTasks, (task) => {
      const isTaskHasParent = _.isArray(task.parent)

      if (isTaskHasParent) {
        const _recursiveFn = (parentTaskId) => {
          const isParentTaskExecuted = _.intersection(_executed, [parentTaskId]).length > 0;

          if (!isParentTaskExecuted) {
            // если родитель не делался, удаляем его
            removeTasks.push(parentTaskId)
            var parentTask = self.getTasksByParent(parentTaskId);

            _recursiveFn(parentTask.parent)
          } else { return }
        }

        _.each(task.parent, (taskId) => {
          _recursiveFn(taskId)
        })
      }
    })

    return _.intersection(_backlog, removeTasks);
  }

  getTasksByParent (parentId) {
    const self = this;

    return _.filter(self.chapterTaskTree.tasks, function (taskCreator) {
      return taskCreator.id === parentId
    })[0]
  }

  getTasks ({ executed = [], executing = [], backlog = [] }) {
    const self = this;
    const _executed = executed.length ? executed : [{ id: void 0 }];
    const _backlog = _.union(executing, backlog, executed);

    let addTasks = this._getTasksToAdd(this.chapterTaskTree, _executed, _backlog)
    let removeTasks = this._getTasksToRemove(addTasks, _executed, _backlog);

    let newBacklog = [
      ..._.filter(backlog, t => _.intersection(removeTasks, [t.id]).length === 0),
      ...addTasks
    ]

    return {
      executed,
      executing,
      backlog: newBacklog,
      toAdd: addTasks.map(t => t.id),
      toRemove: removeTasks,
    };
  }
}

module.exports = TaskProvider;
