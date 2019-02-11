const fs = require('fs')
const path = require('path')
const uniqid = require('uniqid');
const _ = require('lodash');
const readlineSync = require('readline-sync');

const Calendar = require('./models/common/calendar')
const Company = require('./models/business/company')

const Person = require('./models/common/person')
const Task = require('./models/common/task')
const Skills = require('./models/common/skills')

const MarketingChannel = require('./models/marketing/channel')

// const BusinessIdea = require('./models/businessIdea')
// const UnitEconomics = require('./models/unitEconomics')
// const LifeCycle = require('./models/lifeCycle')

// productImprovement
// marketing
// networking
// legal
// team
// management

const tasks = fs.readFileSync(path.resolve(__dirname, 'tasks.txt'), 'utf8')

const TaskProvider = require('./providers/taskProvider')
const ChapterTaskTree = require('./providers/chapterTaskTree')

const assoc = {
  hip: 'hipster',
  hack: 'hacker',
  hust: 'hustler',
}

let id = 1;

function lineToTask(taskLine, taskType) {
  const fields = taskLine.split(',');
  var rv = {
    // id: uniqid(),
    id,
    taskType
  };

  id++;

  for (var i = 0; i < fields.length; i++) {
    if (i === 0) { // _fieldName = Name
      rv.name = fields[i]
      continue;
    }

    const _field = fields[i].split(':')
    const _fieldName = _field[0].trim()
    const _fieldValue = _field[1].trim()

    if (_fieldName === 'skills') {
      rv[_fieldName] = {};
      const skillsArr = _fieldValue.split(';')

      for (var j = 0; j < skillsArr.length; j++) {
        const _skillField = skillsArr[j].split('-')
        const _skillFielddName = assoc[_skillField[0].trim()]
        const _skillFieldValue = _skillField[1].trim()
        rv[_fieldName][_skillFielddName] = +_skillFieldValue;
      }

    } else {
      rv[_fieldName] = +_fieldValue;
    }
  }

  return rv;
}

function taskTransformator(tasks) {
  const tasksLines = tasks.split('\n');

  let rv = [];
  let assignToTask = {};
  let lastTabLevelIndex = 0;

  for (var i = 0; i < tasksLines.length; i++) {
    var line = tasksLines[i];
    if (!line.length) { continue }

    var dataTask = line.split('|')
    var taskType = dataTask[0][dataTask[0].length - 1]
    var tabLevelIndex = dataTask[0].replace(taskType, '').length / 2

    // родителя мы можем понять только по количеству табов..
    var task = lineToTask(dataTask[1], taskType)

    if (!assignToTask[tabLevelIndex]) {
      assignToTask[tabLevelIndex] = []
    }

    // если мы поднимаемся вверх
    if (tabLevelIndex < lastTabLevelIndex) {
      let tablevels = _.keys(assignToTask)

      for (var j = 0; j < tablevels.length; j++) {
        if (tablevels[j] > tabLevelIndex && tablevels[i]) {
          assignToTask[tablevels[i]] = []
        }
      }
    }

    // ^|Root Task, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //   ^|Legal stream, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //   ^|Product improvement stream, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //   ^|Research site dev stream, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //     ±|Site dev by yourself - research, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //       ^|Site dev by yourself - design, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //       ^|Site dev by yourself - development, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //         §|Site dev by yourself - bugfix, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //     ±|Site dev by constructor - research, skills:hip-10;hack-10;hust-10, hours:24, cost: 10
    //       ^|Site dev by constructor - development, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //     ±|Site dev by studio, skills:hip-10;hack-10;hust-10, hours:40, cost: 3000
    //       ^|Site dev by studio - review, skills:hip-10;hack-10;hust-10, hours:8, cost: 0
    //       §|Task after all, skills:hip-10;hack-10;hust-10, hours:8, cost: 0



    let parentAssign = assignToTask[tabLevelIndex-1];
    if (parentAssign) {
      if (taskType === '^') {
        task.parent = [parentAssign[parentAssign.length - 1].id]
      } else if (taskType === '±') {
        task.parent = [parentAssign[parentAssign.length - 1].id]
      } else if (taskType === '§') {
        task.parent = _.map(parentAssign, (t) => { return t.id })
      }
    }

    // если значок ^, то у задачи один родитель
    // если значок ±,
    // если значок §, то у задачи несколько родителей
    //  если задача родитель ^, то задача открывается когда выполнятся все родители
    //  если задача родитель ±, то задача открывается когда выполнится один из родителей
    assignToTask[tabLevelIndex].push(task)
    rv.push(task)

    // console.log(task);
    lastTabLevelIndex = tabLevelIndex;
  }

  return rv
}

start()
async function start() {

  // const task = new Task({ id: 4,
  //   taskType: '^',
  //   parent: [ 1 ],
  //   name: 'Research site dev stream',
  //   skills: { hipster: 10, hacker: 10, hustler: 10 },
  //   hours: 8,
  //   cost: 0 })
  //
  // console.log(task.progress());


  // const _tasks = taskTransformator(tasks);
  // console.log(_tasks);

  // console.log(taskTransformator(tasks));
  // return;

  //TODO: логика task after all не верна,
  // так как нужно брать последние таски в иерхии
  // (сейчас берутся первые...)
  // for (var i = 0; i < _tasks.length; i++) {
  //   console.log(`${_tasks[i].id}: - ${_tasks[i].name}, ${_tasks[i].taskType}${_tasks[i].parent.toString()}`);
  // }

  // Кампания имеет
  // -> Дату начала
  // -> Вложенные в нее деньги
  // -> Стоимость шага
  // -> Какой-то ретеншен от зашедших
  // -> Стоимость перехода
  // -> Конверсию
  //

  // const taskProvider = new TaskProvider({
  //   chapterTaskTree: new ChapterTaskTree({
  //     tasks: taskTransformator(tasks)
  //   })
  // });
  //
  const calendar = new Calendar({
    today: '27.02.2019'
  });
  //
  // const founder = new Person({
  //   name: 'Max',
  //   type: 'hastler',
  //   person: 'founder',
  //   salary: 33,
  //   skills: new Skills({
  //     hipster: 30,
  //     hacker: 20,
  //     hustler: 10
  //   })
  //   // skills: SkillGenerator.generateSkills('founder', 'hastler'),
  //   // friends: []
  // });
  //
  // const company = new Company({
  //   calendar,
  //   taskProvider,
  //   team: [founder],
  //   // businessIdea,
  //   balance: 10000,
  //   tasks: taskProvider.getTasks({})
  // })
  //
  // // console.log(taskProvider.getTasks({}));
  //
  // let status = 'started';
  // while (status === 'started') {
  //   // await self.tick()
  //   // await sleep(self._intervalTime)
  //
  //   var userName = readlineSync.question('...');
  //   if (userName.length) {
  //     status = 'stop'
  //     continue;
  //   }
  //
  //   if (!company.tasks.executing.length && company.tasks.backlog.length) {
  //     company.selectTasks([company.tasks.backlog[0].id])
  //   }
  //
  //   console.log('############# ' + calendar.today.format('DD.MM.YYYY') + ' #############');
  //   company.logInfo();
  //
  //   calendar.simulateDay()
  // }

  // Создать канал
  // Создать кампанию
  // Привязать кампанию к CashGate

  const fbChannel = new MarketingChannel({
    name: 'fb',
    today: calendar.today
  })

  fbChannel.addBudget(15000)
  fbChannel.getDayScore(calendar.today)

  fbChannel.getInfo();

  calendar.simulateDay(7)
  fbChannel.getDayScore(calendar.today)

  fbChannel.getInfo();

  // доход на платящего пользователя
  // сэмулировать сколько дней прошло с предыдущей даты
  // вернуть сколько новых подписчиков, и вероятность их затухания


  // вернуть сколько денег заработано от подписчиков


  //
  // const businessIdea = chapterTaskTree.getDefaultBusinessIdea()
  //
  // business.select(avalibaleTasks[1])
  // business.execute()

  // const lifeCycle = new LifeCycle({ calendar })

  // lifeCycle.addTickHandler(function(info) {
  //   console.log('lifeCycle tick')
  // })

  // lifeCycle.start()
}

return;
