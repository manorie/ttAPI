const mongoose = require('mongoose');
const { expect } = require('chai');
const {
  describe,
  it,
  beforeEach
} = require('mocha');

const { mongoURI } = require('../../config/env');

mongoose.connect(mongoURI, { useNewUrlParser: true });

const { User } = require('../../models/user');
const { userFactory } = require('../factories/user');

describe('models_user', () => {
  describe('validation', () => {
    it('raises an error with empty name', (done) => {
      const u0 = userFactory({ name: '' });

      u0.save((error) => {
        expect(error.errors.name).to.not.eq(undefined);
        expect(error.errors.name.message).to.eq('name is required');
        expect(error.errors.email).to.eq(undefined);
        expect(error.errors.password).to.eq(undefined);
        done();
      });
    });

    it('raises an error with empty email', (done) => {
      const u1 = userFactory({ email: '' });

      u1.save((error) => {
        expect(error.errors.name).to.eq(undefined);
        expect(error.errors.email.message).to.eq('email is required');
        expect(error.errors.password).to.eq(undefined);
        done();
      });
    });


    it('raises an error with empty password', (done) => {
      const u2 = userFactory({ password: '' });

      u2.save((error) => {
        expect(error.errors.name).to.eq(undefined);
        expect(error.errors.email).to.eq(undefined);
        expect(error.errors.password.message).to.eq('password is required');
        done();
      });
    });

    it('raises an error with malformed email addresses', (done) => {
      ['xx@yy', 'dummyMail', '@ll.com', 'as@'].forEach((address) => {
        const u3 = userFactory({ email: address });

        u3.save((error) => {
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
    beforeEach(async () => {
      await User.remove({});
    });

    describe('#find', () => {
      it('should find user with email', async () => {
        await userFactory().save();
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
        let err;
        try {
          await userFactory({
            name: 'y',
            email: 'y@example.com',
            password: 'hashedPassword'
          }).save();
        }
        catch (e) {
          err = e;
        }
        expect(err).to.eq(undefined);
        expect(await User.count()).to.eq(1);

        const user = await User.findOne({ email: 'y@example.com' });
        expect(user).to.be.a('object');
        expect(user.get('name')).to.eq('y');
        expect(user.get('email')).to.eq('y@example.com');
        expect(user.get('password')).to.eq('hashedPassword');

        const { ok } = await User.remove({ email: 'y@example.com' });
        expect(ok).to.eq(1);

        // removing the new user, leaving the one created with before hook
        expect(await User.count()).to.eq(0);
      });
    });

    describe('#create second user with same email', () => {
      it('should not be created and raise error', async () => {
        let err;
        try {
          await userFactory({
            name: 'x',
            email: 'manorie@example.com',
            password: 'y'
          }).save();

          await userFactory({
            name: 'z',
            email: 'manorie@example.com',
            password: 't'
          }).save();
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
