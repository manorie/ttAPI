const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const { server } = require('../server');

const { expect } = chai;
chai.use(chaiHttp);

describe('server', () => {
  describe('/', () => {
    after((done) => {
      server.close();
      done();
    });

    it('responds with status 200', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
