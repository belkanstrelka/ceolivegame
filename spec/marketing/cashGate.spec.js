const CashGate = require('./../../src/models/marketing/cashGate');
const MarketingChannel = require('./../../src/models/marketing/channel');

describe("CashGate", function() {
  describe("constructor", function() {
    it("кидает исключение, если название не передано", function() {
      var fcn = function() {
        new CashGate();
      };

      expect(fcn).toThrowError("name is not defined");
    });

    it("при создании инстанса, генерит уникальные id", function() {
      var cashGate = new CashGate({ name: 'site' });
      var cashGate2 = new CashGate({ name: 'instagramm' });

      expect(cashGate.id === cashGate2.id).toBe(false);
    });

    it("если передаются параметры, они сохраняются в объекте", function() {
      var cashGate = new CashGate({ name: 'site' });

      expect(cashGate.name).toBe('site');
      expect(cashGate.channels.length).toBe(0);
    });
  });

  describe("addChannel", function() {
    var cashGate;

    beforeEach(function() {
      cashGate = new CashGate({ name: 'site' });
    });

    it("если канал не передается, кидается исключение", function() {
      var fcn = function() {
        cashGate.addChannel()
      };

      expect(fcn).toThrowError("channel is not instanceof of MarketingChannel");
    });

    it("при добавлении канала, массив каналов увеличивается", function() {
      cashGate.addChannel(new MarketingChannel({ name: 'instagramm' }))
      expect(cashGate.channels.length).toBe(1);

      cashGate.addChannel(new MarketingChannel({ name: 'fb' }))
      expect(cashGate.channels.length).toBe(2);
    });
  })
});
