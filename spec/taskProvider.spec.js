const ChapterTaskTreeCreator = require('./helpers/creators/chapterTaskTree');
const TaskProvider = require('./../src/providers/taskProvider');

describe("TaskProvider", function() {
  var taskProvider;

  beforeEach(function() {
    taskProvider = new TaskProvider({
      chapterTaskTree: ChapterTaskTreeCreator.getChapterTaskTree()
    });
  });

  describe("constructor", function() {
    it("при создании TaskProvider без задач главы, кидается исключение", function() {
      var fcn = function() {
        new TaskProvider();
      };

      expect(fcn).toThrowError("chapterTaskTree is not defined");
    })

    it("кидает исключение, если chapterTaskTree не instOf ChapterTaskTree", function() {
      var fcn = function() {
        new TaskProvider({
          chapterTaskTree: {}
        });
      };

      expect(fcn).toThrowError("chapterTaskTree is not instanceof of ChapterTaskTree");
    })

    it("Сохраняет chapterTaskTree в инстансе провайдера", function() {
      var chtt = ChapterTaskTreeCreator.getChapterTaskTree();
      var taskPr = new TaskProvider({
        chapterTaskTree: chtt
      })

      expect(taskPr.chapterTaskTree).toBe(chtt);
    })
  })

  describe("getTasks", function() {

    describe("Если нет выполненных задач", function() {
      it("Список выполняемых и бэклог задач пуст, то возвращать задачи без родителей", function() {
        var rv = taskProvider.getTasks({
          executed: [],
          executing: [],
          backlog: []
        })

        expect(rv.executed.length).toBe(0);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(1);
        expect(rv.backlog[0].id).toBe(1);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(1);
        expect(rv.toAdd[0]).toBe(1);
      })

      it("Список выполняемых пуст и в бэклоге рутовая задача, то возвращать пустой массив", function() {
        var rv = taskProvider.getTasks({
          executed: [],
          executing: [],
          backlog: [{ id: 1 }]
        })

        expect(rv.executed.length).toBe(0);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(1);
        expect(rv.backlog[0].id).toBe(1);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(0);
      })

      it("И выполняется рутовая задача, то возвращать пустой массив", function() {
        var rv = taskProvider.getTasks({
          executed: [],
          executing: [{ id: 1 }],
          backlog: []
        })

        expect(rv.executed.length).toBe(0);
        expect(rv.executing.length).toBe(1);
        expect(rv.executing[0].id).toBe(1);
        expect(rv.backlog.length).toBe(0);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(0);
      })
    })

    describe("Если выполнена только 1 задача", function() {
      it("и бэклог с выполняемыми задачами пуст, то вернуть задач с парентом root", function() {
        var rv = taskProvider.getTasks({
          executed: [{ id: 1 }],
          executing: [],
          backlog: []
        })

        expect(rv.executed.length).toBe(1);
        expect(rv.executed[0].id).toBe(1);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(3);
        expect(rv.backlog[0].id).toBe(2);
        expect(rv.backlog[1].id).toBe(3);
        expect(rv.backlog[2].id).toBe(4);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(3);
        expect(rv.toAdd[0]).toBe(2);
        expect(rv.toAdd[1]).toBe(3);
        expect(rv.toAdd[2]).toBe(4);
      })

      it("и в бэклоге есть не все дочки рутовой задачи, то вернуть недостающие", function() {
        var rv = taskProvider.getTasks({
          executed: [{ id: 1 }],
          executing: [],
          backlog: [{ id: 2 }, { id: 4 }]
        })

        expect(rv.executed.length).toBe(1);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(3);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(1);
      })

      it("и в бэклоге есть дочки рутовой задачи, то вернуть пустой массив", function() {
        var rv = taskProvider.getTasks({
          executed: [{ id: 1 }],
          executing: [],
          backlog: [{ id: 2 }, { id: 3 }, { id: 4 }]
        })

        expect(rv.executed.length).toBe(1);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(3);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(0);
      })
    })

    describe("Если начата сцена", function() {
      it("и делается первая задача из нее, то вернуть пустой массив", function() {
        var rv = taskProvider.getTasks({
          executed: [{ id: 1 }],
          executing: [{ id: 4 }],
          backlog: [{ id: 2 }, { id: 3 }]
        })

        expect(rv.executed.length).toBe(1);
        expect(rv.executing.length).toBe(1);
        expect(rv.backlog.length).toBe(2);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(0);
      })

      it("и сделана первая задача из нее, то вернуть развилки сюжета", function() {
        var rv = taskProvider.getTasks({
          executed: [{ id: 1 }, { id: 4 }],
          executing: [],
          backlog: [{ id: 2 }, { id: 3 }]
        })

        expect(rv.executed.length).toBe(2);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(5);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(3);
        expect(rv.toAdd[0]).toBe(5);
        expect(rv.toAdd[1]).toBe(9);
        expect(rv.toAdd[2]).toBe(11);
      })

      it("и мы выбрали одну сюжетную линию, то остальные никуда не исчезают", function() {
        var rv = taskProvider.getTasks({
          executed: [{ id: 1 }, { id: '4.1' }],
          executing: [{ id: '4.2.2' }],
          backlog: [{ id: '2.1' }, { id: '3.1' }, { id: '4.2.1' }, { id: '4.2.3' }]
        })

        expect(rv.executed.length).toBe(2);
        expect(rv.executing.length).toBe(1);
        expect(rv.backlog.length).toBe(4);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(0);
      })

      it("и мы закончили одну задачку из сюжета, то сюжет продолжается", function() {
        var rv = taskProvider.getTasks({
          executed: [{ id: 1 }, { id: '4.1' }, { id: '4.2.2' }],
          executing: [],
          backlog: [{ id: '2.1' }, { id: '3.1' }, { id: '4.2.1' }, { id: '4.2.3' }]
        })

        expect(rv.executed.length).toBe(3);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(5);

        expect(rv.toRemove.length).toBe(0);
        expect(rv.toAdd.length).toBe(1);
        expect(rv.toAdd[0]).toBe('4.2.2.2');

        var rv2 = taskProvider.getTasks({
          executed: [{ id: 1 }, { id: '4.1' }, { id: '4.2.2' }, { id: '4.2.2.2' }],
          executing: [],
          backlog: [{ id: '2.1' }, { id: '3.1' }, { id: '4.2.1' }, { id: '4.2.3' }]
        })

        expect(rv2.executed.length).toBe(4);
        expect(rv2.executing.length).toBe(0);
        expect(rv2.backlog.length).toBe(5);

        expect(rv2.toRemove.length).toBe(0);
        expect(rv2.toAdd.length).toBe(1);
        expect(rv2.toAdd[0]).toBe('4.2.2.3');
      })

      it("и мы сделали последнюю задачу в развилке, то мы закрываем задачи других развилок", function() {
        var rv = taskProvider.getTasks({
          executed: [
            { id: 1 }, { id: '4.1' }, { id: '4.2.2' },
            { id: '4.2.2.2' }, { id: '4.2.2.3' }
          ],
          executing: [],
          backlog: [
            { id: '2.1' }, { id: '3.1' }, { id: '4.2.1' }, { id: '4.2.3' }
          ]
        })

        expect(rv.executed.length).toBe(5);
        expect(rv.executing.length).toBe(0);
        expect(rv.backlog.length).toBe(3);

        expect(rv.toRemove.length).toBe(2);
        expect(rv.toRemove[0]).toBe('4.2.1');
        expect(rv.toRemove[1]).toBe('4.2.3');

        expect(rv.toAdd.length).toBe(1);
        expect(rv.toAdd[0]).toBe('4.3');
      })
    })

    xdescribe("Если сцена паттерновая", function() {
      it("TODO", function() {
        expect(0).toBe(1);
      })
    })
  })
});
