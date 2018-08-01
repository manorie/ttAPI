const mongoose = require('mongoose');
const { expect } = require('chai');
const {
  describe,
  it,
  beforeEach
} = require('mocha');

const { mongoURI } = require('../../config/env');

mongoose.connect(mongoURI, { useNewUrlParser: true });

const { Tag } = require('../../models/tag');
const { User } = require('../../models/user');
const { Task } = require('../../models/task');
const { tagFactory } = require('../factories/tag');
const { userFactory } = require('../factories/user');
const { taskFactory } = require('../factories/task');

describe('models_task', () => {
  beforeEach(async () => {
    await Task.remove({});
    await Tag.remove({});
    await User.remove({});
  });

  describe('validation', () => {
    it('raises an error with empty start date', async () => {
      const t0 = taskFactory({ start: undefined, end: new Date() }, userFactory());

      let err;
      try {
        await t0.save();
      }
      catch (e) {
        err = e;
      }
      expect(await Task.count()).to.eq(0);
      expect(err.message).to.contain('start date');
    });

    it('raises an error with empty end date', async () => {
      const t0 = taskFactory({ start: new Date(), end: undefined }, userFactory());

      let err;
      try {
        await t0.save();
      }
      catch (e) {
        err = e;
      }
      expect(await Task.count()).to.eq(0);
      expect(err.message).to.contain('end date');
    });

    it('raises an error with empty name', async () => {
      const t0 = taskFactory({ name: '' }, userFactory());

      let err;
      try {
        await t0.save();
      }
      catch (e) {
        err = e;
      }
      expect(await Task.count()).to.eq(0);
      expect(err.message).to.contain('name is required');
    });

    it('raises an error when start date is bigger than end date', async () => {
      const t0 = taskFactory({
        start: Date.parse('03 03 2018'),
        end: Date.parse('02 02 2018')
      }, userFactory());

      let err;
      try {
        await t0.save();
      }
      catch (e) {
        err = e;
      }
      expect(await Task.count()).to.eq(0);
      expect(err.message).to.contain('start date should be less than end date');
    });
  });

  describe('persistance', () => {
    describe('#find', () => {
      it('should be found with user', async () => {
        await taskFactory({ name: 'task0' },
          userFactory({ email: 'x@y.com' })).validate();
      });

      it('should be found with user and tag name', async () => {

      });

      it('should be found with user and tag names', async () => {

      });

      it('should be found with user and time period', async () => {

      });
    });

    describe('#create', () => {
      it('should not fail', async () => {

      });

      it('should not fail on duplicate records', async () => {

      });
    });

    describe('#update', () => {
      it('should not fail', async () => {

      });
    });

    describe('#destroy', () => {
      it('should not fail', async () => {

      });
    });
  });
});
