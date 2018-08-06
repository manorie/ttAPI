const chai = require('chai');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const {
  describe,
  it,
  after,
  before
} = require('mocha');
const { server } = require('../../server');
const { userFactory } = require('../factories/user');
const { User } = require('../../models/user');

const { expect } = chai;
chai.use(chaiHttp);

// close mongodb and server connection after every endpoint test
after(async () => {
  await server.close();
  await mongoose.connection.close();
});

describe('controllers_auth', () => {
  before(async () => {
    await User.remove({});
    await userFactory({
      name: 'manorie@example.com',
      password: bcrypt.hashSync('123456', 8)
    }).save();
  });

  describe('/login', () => {
    describe('validations', () => {
      it('responds with status 400 when email is empty', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: '', password: 'xxxxxx' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.be.equal('email and password is required');
            done();
          });
      });

      it('responds with status 400 when password is empty', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: 'manorie@example.com', password: '' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.be.equal('email and password is required');
            done();
          });
      });

      it('responds with status 400 when email is invalid', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: 'dummyEmail', password: 'xxxxxx' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.be.equal('invalid email address');
            done();
          });
      });

      it('responds with status 400 when password is short', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: 'manorie@example.com', password: '12345' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.be.equal('password is too short');
            done();
          });
      });

      it('responds with status 400 when user not found', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: 'dummyUser@example.com', password: '123456' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.be.equal('invalid email address or password');
            done();
          });
      });
    });

    describe('user_present', () => {
      it('when password is wrong', (done) => {
        chai.request(server)
          .post('/login')
          .send({ email: 'manorie@example.com', password: 'xxxxxx' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.be.equal('invalid email address or password');
            done();
          });
      });

      it('when password is right', async () => {
        let resp;
        try {
          resp = await chai.request(server)
            .post('/login')
            .send({ email: 'manorie@example.com', password: '123456' });
        }
        catch (err) {
          expect(err).to.eq(undefined);
        }
        const { id } = await User.findOne({ email: 'manorie@example.com' });

        expect(resp).to.have.status(200);
        expect(id).to.eq(resp.body.id);
        expect(resp.body.auth).to.eq(true);
        expect(resp.body.token).to.not.eq('');
        expect(resp.body.token).to.not.eq(undefined);
      });
    });
  });
});
