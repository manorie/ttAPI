const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  describe, it, after
} = require('mocha');
const { server, mongoose } = require('../server');
// const { logger } = require('../logger');

const { expect } = chai;
chai.use(chaiHttp);

// close mongodb and server connection after every endpoint test
after((done) => {
  server.close();
  mongoose.connection.close();

  done();
});

describe('server', () => {
  describe('/', () => {
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
