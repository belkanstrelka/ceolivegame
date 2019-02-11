const Skills = require('./../src/models/common/skills')
const SkillRatioBalancer = require('./../src/models/utils/skillRatioBalancer');

describe("SkillRatioBalancer", function() {
  var skillRatioBalancer;

  beforeEach(function() {
    skillRatioBalancer = new SkillRatioBalancer();
  });

  describe("getSkillRatio", function() {
    it("кидает исключение, если первым параметром передан не чувак", function() {
      const taskSkills = new Skills({ hacker: 30 });

      var fcn = function() {
        skillRatioBalancer.getSkillRatio(null, taskSkills)
      };

      expect(fcn).toThrowError("personSkills is not instanceof of Skills");
    })

    it("кидает исключение, если вторым параметром передана не задача", function() {
      const personSkills = new Skills({
        hipster: 30,
        hacker: 20,
        hustler: 10
      });

      var fcn = function() {
        skillRatioBalancer.getSkillRatio(personSkills, null)
      };

      expect(fcn).toThrowError("taskRequiredSkills is not instanceof of Skills");
    })

    describe("возвращает отношение скиллов испольнителя к задаче", function() {
      it("если скилы исполнителя меньше необходимых, то коэффициент > 1", function() {
        const personSkills = new Skills({
          hipster: 30,
          hacker: 20,
          hustler: 10
        });
        const taskSkills = new Skills({ hacker: 30 });

        const skillRatio = skillRatioBalancer.getSkillRatio(personSkills, taskSkills)

        expect(skillRatio > 1).toBeTruthy();
      })

      it("если скилы исполнителя совпадают с необходимыми, то коэффициент = 1", function() {
        const personSkills = new Skills({
          hipster: 30,
          hacker: 30,
          hustler: 10
        });
        const taskSkills = new Skills({ hacker: 30 });

        const skillRatio = skillRatioBalancer.getSkillRatio(personSkills, taskSkills)

        expect(skillRatio == 1).toBeTruthy();
      })

      it("если скилы исполнителя выше необходимых, то коэффициент < 1", function() {
        const personSkills = new Skills({
          hipster: 30,
          hacker: 32,
          hustler: 10
        });
        const taskSkills = new Skills({ hacker: 30 });

        const skillRatio = skillRatioBalancer.getSkillRatio(personSkills, taskSkills)

        expect(skillRatio < 1).toBeTruthy();
      })
    })
  })

  describe("getSkillImprovements", function() {
    it("кидает исключение, если первым параметром передан не чувак", function() {
      const taskSkills = new Skills({ hacker: 30 });

      var fcn = function() {
        skillRatioBalancer.getSkillImprovements(null, taskSkills)
      };

      expect(fcn).toThrowError("personSkills is not instanceof of Skills");
    })

    it("кидает исключение, если вторым параметром передана не задача", function() {
      const personSkills = new Skills({
        hipster: 30,
        hacker: 20,
        hustler: 10
      });

      var fcn = function() {
        skillRatioBalancer.getSkillImprovements(personSkills)
      };

      expect(fcn).toThrowError("taskRequiredSkills is not instanceof of Skills");
    })

    describe("возвращает улучшение скиллов испольнителя от задачи", function() {
      it("todo", function() {
        expect(false).toBeTruthy();
      })
    })
  })
});
