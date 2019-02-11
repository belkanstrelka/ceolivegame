const Skills = require('./../common/skills')
const CONST = 2;

class SkillRatioBalancer {
  constructor(params = {}) { }

  _getRatioCoef(pSkills, tSkills) {
    const hipsterDifferent = tSkills.hipster - pSkills.hipster
    const hackerDifferent = tSkills.hacker - pSkills.hacker
    const hustlerDifferent = tSkills.hustler - pSkills.hustler

    let worstSkill = 'hipster';

    if (hipsterDifferent > hackerDifferent) {
      worstSkill = hipsterDifferent > hustlerDifferent
        ? 'hipster'
        : 'hustler'
    } else {
      worstSkill =  hackerDifferent > hustlerDifferent
        ? 'hacker'
        : 'hustler'
    }

    const skillsRatio = tSkills[worstSkill] / pSkills[worstSkill]
    const ratioCoef = CONST / Math.pow(CONST, skillsRatio)

    return 1 / ratioCoef;
  }

  getSkillRatio(personSkills, taskRequiredSkills) {
    if (!(personSkills && personSkills instanceof Skills))
      throw new Error(`personSkills is not instanceof of Skills`)

    if (!(taskRequiredSkills && taskRequiredSkills instanceof Skills))
      throw new Error(`taskRequiredSkills is not instanceof of Skills`)

    return this._getRatioCoef(personSkills, taskRequiredSkills);
  }

  getSkillImprovements(personSkills, taskReqSkills) {
    if (!(personSkills && personSkills instanceof Skills))
      throw new Error(`personSkills is not instanceof of Skills`)

    if (!(taskReqSkills && taskReqSkills instanceof Skills))
      throw new Error(`taskRequiredSkills is not instanceof of Skills`)

    const hipsterDiff = taskReqSkills.hipster - personSkills.hipster
    const hackerDiff = taskReqSkills.hacker - personSkills.hacker
    const hustlerDiff = taskReqSkills.hustler - personSkills.hustler

    const _getRandomImpr = (value) => {
      return value > 0
        ? _.round(_.random(value / 2, value), 2)
        : 0
    }

    return {
      hipster: _getRandomImpr(hipsterDiff),
      hacker: _getRandomImpr(hackerDiff),
      hustler: _getRandomImpr(hustlerDiff)
    }
  }
}

module.exports = SkillRatioBalancer;
