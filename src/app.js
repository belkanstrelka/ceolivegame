
const Person = require('./models/person')
const Company = require('./models/company')
const UnitEconomics = require('./models/unitEconomics')
const LifeCycle = require('./models/lifeCycle')

start()

async function start() {

  // const chapterTaskTree = new ChapterTaskTree({
  //
  // })

  // TODO: Gen Random skills depends on character
  const founder = new Person({
    name: '',
    type: 'freelancer/agency/mentor/friend/hastler/hacker/hipster/investor',
    skills: {
      hipster: 50,
      hacker: 50,
      hustler: 50,
    },
    friends: []
  });

  const businessIdea = {} //founder.genIdea();

  const company = new Company({
    businessIdea,
    unitEconomics: new UnitEconomics({}),
    team: [founder],
    tasks: []
  })

  const lifeCycle = new LifeCycle({ founder, company })

  lifeCycle.addTickHandler(function(info) {
    console.log('lifeCycle tick')
  })

  lifeCycle.start()
}

return;
