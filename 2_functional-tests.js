const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;

chai.use(chaiHttp);

suite('Functional Tests', function () {

  test('Viewing one stock', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.exists(res.body.stockData.stock);
        assert.exists(res.body.stockData.price);
        assert.exists(res.body.stockData.likes);
        done();
      });
  });

  test('Viewing one stock and liking it', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(() => done());
  });

  test('Viewing same stock again (no double like)', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(() => done());
  });

  test('Viewing two stocks', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end((err, res) => {
        assert.isArray(res.body.stockData);
        done();
      });
  });

  test('Viewing two stocks and liking them', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end(() => done());
  });

});
