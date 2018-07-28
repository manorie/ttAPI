const mongoose = require('mongoose');
const { expect } = require('chai');
const {
  describe,
  it,
  before
} = require('mocha');

const { mongoURI } = require('../../config/env');

mongoose.connect(mongoURI, { useNewUrlParser: true });

const { User } = require('../../models/user');

describe('models_user', () => {
  // after((done) => {
  //   mongoose.connection.close(() => done());
  // });

  describe('validation', () => {
    it('raises an error with empty name', (done) => {
      const u0 = new User({
        name: '',
        email: 'manorie@example.com',
        password: 'hashedPassword'
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
        password: 'hashedPassword'
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
          password: 'hashedPassword'
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
    before(async () => {
      await User.remove({});
      await User.create({
        name: 'manorie',
        email: 'manorie@example.com',
        password: 'hashedPassword'
      });
    });

    describe('#find', () => {
      it('should find user with email', async () => {
        expect(await User.count()).to.eq(1);

        const user = await User.findOne({ email: 'manorie@example.com' });
        expect(user).to.be.a('object');
        expect(user.get('name')).to.eq('manorie');
        expect(user.get('email')).to.eq('manorie@example.com');
        expect(user.get('password')).to.eq('hashedPassword');
      });
    });

    describe('#create and #destroy a user', () => {
      it('should not fail', async () => {
        expect(await User.count()).to.eq(1);

        let err;
        try {
          await User.create({
            name: 'y',
            email: 'y@example.com',
            password: 'hashedPassword'
          });
        }
        catch (e) {
          err = e;
        }
        expect(err).to.eq(undefined);
        expect(await User.count()).to.eq(2);

        const user = await User.findOne({ email: 'y@example.com' });
        expect(user).to.be.a('object');
        expect(user.get('name')).to.eq('y');
        expect(user.get('email')).to.eq('y@example.com');
        expect(user.get('password')).to.eq('hashedPassword');

        const { ok } = await User.remove({ email: 'y@example.com' });
        expect(ok).to.eq(1);

        // removing the new user, leaving the one created with before hook
        expect(await User.count()).to.eq(1);
      });
    });

    describe('#create second user with same email', () => {
      it('should not be created and raise error', async () => {
        expect(await User.count()).to.eq(1);

        let err;
        try {
          await User.create({
            name: 'x',
            email: 'manorie@example.com',
            password: 'y'
          });
        }
        catch (e) {
          err = e;
        }

        expect(await User.count()).to.eq(1);
        expect(err.message).to.contain('duplicate key error');
      });
    });
  });
});
