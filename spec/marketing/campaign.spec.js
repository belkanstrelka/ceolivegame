const MarketingCampaign = require('./../../src/models/marketing/campaign');
// const MarketingChannel = require('./../../src/models/marketing/channel');
// const CashGate = require('./../../src/models/marketing/cashGate');

const moment = require('moment');
const today = moment('12.12.2018', 'DD.MM.YYYY')
// const cashGate = new CashGate({ name: 'site' });
// const channel = new MarketingChannel({
//   name: 'facebook',
//   today
// });

// Кампания имеет
// -> Дату начала
// -> Стоимость шага
// -> Какой-то ретеншен от зашедших
// -> Стоимость перехода
// -> Конверсию

describe("MarketingCampaign", function() {
  var campaign;

  beforeEach(function() {
    campaign = new MarketingCampaign({
      dateCreated: today,
      cpa: 100,
      conv: 0.3,
    });
  });

  describe("constructor", function() {
    describe("params.name", function() {
      it("при отсутсвии name, создается автоматом", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cpa: 100,
          conv: 0.3
        });

        expect(c.name).not.toBe(undefined);
      });

      it("генерится каждый раз уникальное имя", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cpa: 100,
          conv: 0.3
        });

        let c2 = new MarketingCampaign({
          dateCreated: today,
          cpa: 100,
          conv: 0.3
        });

        expect(c.name).not.toBe(c2.name);
      });
    });

    describe("params.cpa", function() {
      it("при отсутсвии cpa кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            conv: 0.3
          });
        };

        expect(fcn).toThrowError("cpa is not defined");
      });

      it("если cpa не число кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            cpa: 'not a number',
            conv: 0.3
          });
        };

        expect(fcn).toThrowError("cpa must be a number");
      });

      it("при передачи cpa оно сохраняется в поле", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cpa: 137,
          conv: 0.3
        });

        expect(c.cpa).toBe(137);
      });
    });

    describe("params.conv", function() {
      it("при отсутсвии conv кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            cpa: 100,
          });
        };

        expect(fcn).toThrowError("conv is not defined");
      });

      it("если conv не число кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            cpa: 100,
            conv: 'not a number'
          });
        };

        expect(fcn).toThrowError("conv must be a number");
      });

      it("при передачи conv оно сохраняется в поле", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cpa: 137,
          conv: 3
        });

        expect(c.conv).toBe(3);
      });
    });

    describe("params.limit", function() {
      it("при отсутсвии limit по умелчанию ставится 150", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cpa: 137,
          conv: 3
        });

        expect(c.limit).toBe(150);
      });

      it("если параметр передан, он сохраняется в поле", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          limit: 107,
          cpa: 137,
          conv: 3
        });

        expect(c.limit).toBe(107);
      });
    });

    describe("params.dateCreated", function() {
      it("при отсутсвии dateCreated кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            cpa: 100,
            conv: 0.3,
          });
        };

        expect(fcn).toThrowError("dateCreated is not defined");
      });

      it("если dateCreated не moment() кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: 12,
            cpa: 100,
            conv: 0.3
          });
        };

        expect(fcn).toThrowError("dateCreated must be instanceof moment");
      });

      it("при передачи dateCreated оно сохраняется в поле", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cpa: 137,
          conv: 0.3
        });

        today.add(7, 'days')

        expect(c.dateCreated.format('DD.MM.YYYY')).toBe('12.12.2018');
      });
    });

    xdescribe("params.cashGate", function() {
      it("при отсутсвии cashGate кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            сpa: 100,
            conv: 0.3,
          });
        };

        expect(fcn).toThrowError("cashGate is not defined");
      });

      it("если cashGate не CashGate кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            cashGate: 12,
            cpa: 'not a number',
            conv: 0.3
          });
        };

        expect(fcn).toThrowError("cashGate must be instanceof CashGate");
      });

      it("при передачи cashGate оно сохраняется в поле", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cashGate: cashGate,
          cpa: 137,
          conv: 0.3
        });

        expect(c.cashGate).toBe(cashGate);
      });
    });

    xdescribe("params.channel", function() {
      it("при отсутсвии channel кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            сpa: 100,
            conv: 0.3,
          });
        };

        expect(fcn).toThrowError("channel is not defined");
      });

      it("если channel не MarketingChannel кидается исключение", function() {
        let c;
        var fcn = function() {
          c = new MarketingCampaign({
            dateCreated: today,
            cpa: 'not a number',
            conv: 0.3
          });
        };

        expect(fcn).toThrowError("channel must be instanceof MarketingChannel");
      });

      it("при передачи channel он сохраняется в поле", function() {
        let c = new MarketingCampaign({
          dateCreated: today,
          cpa: 137,
          conv: 0.3
        });

        expect(c.dateCreated.format('DD.MM.YYYY')).toBe('12.12.2018');
      });
    });

    it("по умолчанию ставятся пустые historical", function() {
      expect(campaign.historical.ua).toBe(0);
      expect(campaign.historical.leads).toBe(0);
      expect(campaign.historical.spent).toBe(0);
    });

    it("по умолчанию isRunning ставятся в false", function() {
      expect(campaign.isRunning).toBe(false);
    });
  });

  describe("start", function() {
    it("переводит isRunning в true", function() {
      campaign.start()
      expect(campaign.isRunning).toBe(true);
    });
  });

  describe("stop", function() {
    it("переводит isRunning в false", function() {
      campaign.start()
      expect(campaign.isRunning).toBe(true);

      campaign.stop()
      expect(campaign.isRunning).toBe(false);
    });
  });

  describe("getDayScore", function() {
    beforeEach(function() {
      campaign = new MarketingCampaign({
        dateCreated: today,
        cpa: 100,
        conv: 0.3,
      });
    });

    describe("params.limit", function() {
      it("если передан limit, то подсчеты ведутся по нему", function() {
        let dayScore = campaign.getDayScore({
          limit: 3000
        })

        expect(dayScore.ua).toBe(30);
        expect(dayScore.leads).toBe(9);
      })

      it("если limit не передат, то подсчеты ведется по лимиту кампании", function() {
        let dayScore = campaign.getDayScore()

        expect(dayScore.ua).toBe(2);
        expect(dayScore.leads).toBe(1);
      })
    })

    it("возвращает количество привлеченных людей", function() {
      let dayScore = campaign.getDayScore({
        limit: 3000
      })

      expect(dayScore.ua).toBe(30);
      expect(dayScore.leads).toBe(9);
    })

    it("возвращает количество привлеченных лидов, с исторической погрешностью", function() {
      let dayScore;

      dayScore = campaign.getDayScore({ limit: 150 })
      expect(dayScore.ua).toBe(2);
      expect(dayScore.leads).toBe(1);

      dayScore = campaign.getDayScore({ limit: 150 })
      expect(dayScore.ua).toBe(1);
      expect(dayScore.leads).toBe(0);

      dayScore = campaign.getDayScore({ limit: 150 })
      expect(dayScore.ua).toBe(2);
      expect(dayScore.leads).toBe(1);
    })

    describe("возвращает количество потраченных за день денег", function() {
      it("если передан limit, то возвращается он", function() {
        let dayScore = campaign.getDayScore({
          limit: 3000
        })

        expect(dayScore.spent).toBe(3000);
      })

      it("если limit не передан, то возвращается дефолтный", function() {
        let dayScore = campaign.getDayScore()

        expect(dayScore.spent).toBe(150);
      })
    })

    it("обновляет исторические данные", function() {
      campaign = new MarketingCampaign({
        dateCreated: today,
        cpa: 100,
        conv: 0.3,
      });

      let dayScore = campaign.getDayScore({
        limit: 3000
      })

      expect(campaign.historical.ua).toBe(30);
      expect(campaign.historical.leads).toBe(9);

      let dayScore2 = campaign.getDayScore({
        limit: 3000
      })

      expect(campaign.historical.ua).toBe(60);
      expect(campaign.historical.leads).toBe(18);
    });
  });
});
