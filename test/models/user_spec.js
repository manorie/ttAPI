const mongoose = require('mongoose');
const { expect } = require('chai');
const {
  describe,
  it,
  after,
  before
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
    before((done) => {
      User.remove().then(() => {
        done();
      });
    });

    it('persist the record as expected', (done) => {
      const u3 = new User({
        name: 'manorie',
        email: 'manorie@example.com',
        password: 'hashedsomelongstring'
      });

      u3.save((error) => {
        expect(error).to.eq(null);

        User
          .findOne({ email: 'manorie@example.com' }, (user) => {
            console.log(user);
            done();
          });
      });
    });
  });
});
