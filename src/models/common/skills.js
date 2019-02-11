class Skills {
  constructor(params = {}) {
    const { hipster, hacker, hustler } = params;

    this.hipster = hipster || 0
    this.hacker = hacker || 0
    this.hustler = hustler || 0
  }

  improve(skillsImprovents = {}) {
    const { hipster, hacker, hustler } = skillsImprovents;

    this.hipster += hipster || 0;
    this.hacker += hacker || 0;
    this.hustler += hustler || 0;
  }
}

module.exports = Skills;
