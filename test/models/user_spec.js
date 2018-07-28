const mongoose = require('mongoose');
const { expect } = require('chai');
const {
  describe,
  it,
  before,
  after
} = require('mocha');

const { mongoURI } = require('../../config/env');

mongoose.connect(mongoURI, { useNewUrlParser: true });

const User = require('../../models/user');

describe('models_user', () => {
  describe('validations', () => {
    it('raises an error with empty name', (done) => {
      const u0 = new User({
        name: '',
        email: 'manorie@example.com',
        password: 'nonhashedpass'
      });

      u0.save((error) => {
        expect(error.errors.name).to.not.eq(undefined);
        expect(error.errors.name.message).to.eq('name is required');
        expect(error.errors.email).to.eq(undefined);
        expect(error.errors.password).to.eq(undefined);
        done();
      });
    });

    it('raises an error with empty email', (done) => {
      const u1 = new User({
        name: 'manorie',
        email: '',
        password: 'nonhashedpass'
      });

      u1.save((error) => {
        expect(error.errors.name).to.eq(undefined);
        expect(error.errors.email.message).to.eq('email is required');
        expect(error.errors.password).to.eq(undefined);
        done();
      });
    });


    it('raises an error with empty password', (done) => {
      const u1 = new User({
        name: 'manorie',
        email: 'manorie@example.com',
        password: ''
      });

      u1.save((error) => {
        expect(error.errors.name).to.eq(undefined);
        expect(error.errors.email).to.eq(undefined);
        expect(error.errors.password.message).to.eq('password is required');
        done();
      });
    });

    it('raises an error with malformatted email adresses', (done) => {
      ['xx@yy', 'dumymail', '@ll.com', 'as@'].forEach((address) => {
        const u2 = new User({
          name: 'manorie',
          email: address,
          password: 'nonhashedpass'
        });

        u2.save((error) => {
          expect(error.errors.name).to.eq(undefined);
          expect(error.errors.email.message)
            .to
            .eq(`${address} is not a valid email address`);
          expect(error.errors.password).to.eq(undefined);
        });
      });
      done();
    });
  });

  describe('persistance', () => {
    after(async () => {
      await User.remove({});
    });

    before(async () => {
      await User.create({
        name: 'manorie',
        email: 'manorie@example.com',
        password: 'nonhashedpass'
      });
    });

    describe('#find()', () => {
      it('should find user with email', async () => {
        expect(await User.count()).to.eq(1);

        const user = await User.findOne({ email: 'manorie@example.com' });
        expect(user).to.be.a('object');
        expect(user.get('name')).to.eq('manorie');
        expect(user.get('email')).to.eq('manorie@example.com');
        expect(user.get('password')).to.eq('nonhashedpass');
      });
    });

    describe('#create second user with same email', () => {
      it('should not be created and raise error', async () => {
        expect(await User.count()).to.eq(1);

        await User.create({
          name: 'x',
          email: 'manorie@example.com',
          password: 'y'
        });

        expect(await User.count()).to.eq(1);
      });
    });
  });
});
