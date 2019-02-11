const MarketingChannel = require('./../../src/models/marketing/channel');
const MarketingCampaign = require('./../../src/models/marketing/campaign');

const moment = require('moment');
let today = moment('12.12.2018', 'DD.MM.YYYY')

describe("MarketingChannel", function() {
  describe("constructor", function() {
    describe("params.name", function() {
      it("кидает исключение, если название не передано", function() {
        var fcn = function() {
          new MarketingChannel({
            today
          });
        };

        expect(fcn).toThrowError("name is not defined");
      });

      it("если передаются параметры, они сохраняются в объекте", function() {
        var mc = new MarketingChannel({
          today,
          name: 'instagram'
        });

        expect(mc.name).toBe('instagram');
      });
    });

    describe("params.budget", function() {
      it("кидает исключение, если budget не передан, устанавливает его в 0", function() {
        const mc = new MarketingChannel({
          name: 'test',
          today,
        });

        expect(mc.budget).toBe(0);
      });

      it("если передаются параметры, они сохраняются в объекте", function() {
        const mc = new MarketingChannel({
          today,
          name: 'test',
          budget: 2000,
        });

        expect(mc.budget).toBe(2000);
      });
    });

    describe("params.today", function() {
      it("при отсутсвии today кидается исключение", function() {
        var fcn = function() {
          new MarketingChannel({
            name: 'test'
          });
        };

        expect(fcn).toThrowError("today is not defined");
      });

      it("если today не moment() кидается исключение", function() {
        var fcn = function() {
          new MarketingChannel({
            name: 'test',
            today: 12,
          });
        };

        expect(fcn).toThrowError("today must be instanceof moment");
      });

      it("при передачи today оно сохраняется в поле", function() {
        const dateCreated = moment('12.12.2018', 'DD.MM.YYYY')

        let mc = new MarketingChannel({
          name: 'test',
          today: dateCreated,
        });

        dateCreated.add(7, 'days')

        expect(mc.lastCalculatedDay.format('DD.MM.YYYY')).toBe('12.12.2018');
      });
    });

    it("при создании инстанса, генерит уникальные id", function() {
      var mc = new MarketingChannel({ today, name: 'instagram' });
      var mc2 = new MarketingChannel({ today, name: 'fb' });

      expect(mc.id).not.toBe(mc2.id);
    });

    xit("при создании инстанса, создает пустой массив campaigns", function() {
      var mc = new MarketingChannel({
        today,
        name: 'instagram'
      });

      expect(mc.campaigns.length).toBe(0);
    })

    it("при создании инстанса, создает дефолтную campaign", function() {
      var mc = new MarketingChannel({
        today,
        name: 'instagram'
      });

      expect(mc.campaigns[0] instanceof MarketingCampaign).toBe(true);
      expect(mc.campaigns.length).toBe(1);
    })
  });

  describe("addBudget", function() {
    var mc;

    beforeEach(function() {
      mc = new MarketingChannel({
        name: 'site',
        today,
      });
    });

    it("если добавляется бюджет < 0 кидается ошибка", function() {
      var fcn = function() {
        mc.addBudget(-5000)
      };

      expect(fcn).toThrowError("budget must be positive");
    });

    it("если передается не число, то кидается ошибка", function() {
      var fcn = function() {
        mc.addBudget('test')
      };

      expect(fcn).toThrowError("budget is not a number");
    });

    it("после добавления бюджет увеличивается на переданную сумму", function() {
      mc.addBudget(5000)

      expect(mc.budget).toBe(5000);
    });
  })

  describe("createCampaign", function() {
    var mc;

    beforeEach(function() {
      mc = new MarketingChannel({
        name: 'site', today,
      });
    });

    it("если данные для кампания не передаются, кидается исключение", function() {
      var fcn = function() {
        mc.createCampaign()
      };

      expect(fcn).toThrowError("campaignParams is not defined");
    });

    it("при добавлении канала, массив каналов увеличивается", function() {
      expect(mc.campaigns.length).toBe(1);

      mc.createCampaign({ name: 'instagramm', cpa: 10, conv: 0.4 })
      expect(mc.campaigns.length).toBe(2);

      mc.createCampaign({ name: 'fb', cpa: 10, conv: 0.4 })
      expect(mc.campaigns.length).toBe(3);
    });
  });

  describe("calculateCampaignScores", function() {
    var mc;

    beforeEach(function() {
      mc = new MarketingChannel({
        name: 'site',
        today,
      });
    });

    it("если dayScores не переданы, возвращает нули", function() {
      let result = mc.calculateCampaignScores()

      expect(result.ua).toBe(0);
      expect(result.leads).toBe(0);
      expect(result.spent).toBe(0);
    });

    it("если dayScores пустой массив, возвращает нули", function() {
      let result = mc.calculateCampaignScores([])

      expect(result.ua).toBe(0);
      expect(result.leads).toBe(0);
      expect(result.spent).toBe(0);
    });

    it("если dayScores передан, возвращает сумму полей", function() {
      let result = mc.calculateCampaignScores([
        { ua: 10, leads: 20, spent: 30 },
        { ua: 300, leads: 200, spent: 100 },
        { ua: 9, leads: 8, spent: 7 },
      ])

      expect(result.ua).toBe(319);
      expect(result.leads).toBe(228);
      expect(result.spent).toBe(137);
    });
  })

  describe("getDayScore", function() {
    var mc;

    beforeEach(function() {
      today = moment('12.12.2018', 'DD.MM.YYYY')
      mc = new MarketingChannel({
        name: 'site',
        today,
      });
    });

    it("если calendarDay не передан, кидает исключение", function() {
      var fcn = function() {
        mc.getDayScore()
      };

      expect(fcn).toThrowError("calendarDay is not defined");
    });

    it("если calendarDay не instanceof moment, кидает исключение", function() {
      var fcn = function() {
        mc.getDayScore(12)
      };

      expect(fcn).toThrowError("calendarDay must be instanceof moment");
    });

    it("обновляет последнюю дату посчета", function() {
      today.add(1, 'days')
      expect(mc.lastCalculatedDay.format('DD.MM.YYYY')).toBe('12.12.2018');
      today.add(1, 'days')
      mc.getDayScore(today)
      today.add(1, 'days')
      expect(mc.lastCalculatedDay.format('DD.MM.YYYY')).toBe('14.12.2018');
    });

    it("если budget равен 0, то возвращает 0", function() {
      today.add(1, 'days')

      expect(mc.budget).toBe(0);

      var res = mc.getDayScore(today)

      expect(res.ua).toBe(0);
      expect(res.leads).toBe(0);
      expect(res.spent).toBe(0);
    });

    it("если budget < лимита по кампании, то выясняет данные по кампании с новым лимитом", function() {
      expect(false).toBe(true);
    });

    it("если budget >= лимиту по кампании, то выясняет данные по кампании с деволтным лимитом", function() {
      expect(false).toBe(true);
    });

    it("возвращает сумму всех dayScore кампаний в канале", function() {
      expect(false).toBe(true);
    });
  })
});
