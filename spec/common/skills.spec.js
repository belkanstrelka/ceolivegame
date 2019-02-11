const Skills = require('./../../src/models/common/skills');

describe("Skills", function() {
  describe("constructor", function() {
    it("при пустом конструкторе, всем свойствам ставится 0", function() {
      var skills = new Skills();

      expect(skills.hacker).toBe(0);
      expect(skills.hustler).toBe(0);
      expect(skills.hipster).toBe(0);
    });

    it("если передаются не все параметры, то вместо пропущенных ставится 0", function() {
      var skills = new Skills({
        hustler: 30
      });

      expect(skills.hacker).toBe(0);
      expect(skills.hipster).toBe(0);
      expect(skills.hustler).toBe(30);
    });

    it("если передаются все параметры, они сохраняются в объекте", function() {
      var skills = new Skills({
        hacker: 20,
        hustler: 30,
        hipster: 40,
      });

      expect(skills.hacker).toBe(20);
      expect(skills.hustler).toBe(30);
      expect(skills.hipster).toBe(40);
    });
  });

  describe("improve", function() {
    it("прибавляет переданные параметры к существующим", function() {
      var skills = new Skills({
        hacker: 20,
        hustler: 30,
        hipster: 40,
      });

      skills.improve({
        hacker: 20,
        hustler: 30,
        hipster: 40,
      })

      expect(skills.hacker).toBe(40);
      expect(skills.hustler).toBe(60);
      expect(skills.hipster).toBe(80);
    })

    it("прибавляет 0, если параметр не задан", function() {
      var skills = new Skills({
        hacker: 20,
        hustler: 30,
        hipster: 40,
      });

      skills.improve()

      expect(skills.hacker).toBe(20);
      expect(skills.hustler).toBe(30);
      expect(skills.hipster).toBe(40);
    })
  })
});
