const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;

chai.use(chaiHttp);

suite('Functional Tests', function () {

  test('Viewing one stock', done => {
    chai.request(server).get('/api/stock-prices?stock=GOOG').end((e, r) => {
      assert.equal(r.status, 200);
      assert.exists(r.body.stockData.stock);
      done();
    });
  });

  test('Viewing one stock and liking it', done => {
    chai.request(server).get('/api/stock-prices?stock=GOOG&like=true').end(() => done());
  });

  test('Viewing same stock again', done => {
    chai.request(server).get('/api/stock-prices?stock=GOOG&like=true').end(() => done());
  });

  test('Viewing two stocks', done => {
    chai.request(server).get('/api/stock-prices?stock=GOOG&stock=MSFT').end((e, r) => {
      assert.isArray(r.body.stockData);
      done();
    });
  });

  test('Viewing two stocks and liking', done => {
    chai.request(server).get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true').end(() => done());
  });

});
