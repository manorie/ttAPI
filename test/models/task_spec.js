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
      expect(err.message).to.contain('end date should be greater than start date');
    });
  });

  describe('persistance', () => {
    describe('#find', () => {
      it('should be found with user', async () => {
        await taskFactory({
          name: 'task0',
          start: Date.parse('02 03 2018'),
          end: Date.parse('03 04 2018')
        }, userFactory({ email: 'x@y.com' })).save();

        const u0 = await User.findOne({ email: 'x@y.com' });
        const t0 = await Task.find({ user: u0 });

        expect(t0).to.be.a('array');
        expect(t0.length).to.eq(1);
        expect(t0[0].name).to.eq('task0');
        expect(Date.parse(t0[0].start)).to.eq(1517601600000);
        expect(Date.parse(t0[0].end)).to.eq(1520107200000);
      });

      it('should be found with user and tag name', async () => {
        const u0 = await userFactory({ email: 'z@a.com' }).save();
        const tag0 = await tagFactory({ name: 'u0Tag' }, u0).save();

        await taskFactory({
          name: 'task0',
          start: Date.parse('03 04 2018'),
          end: Date.parse('05 06 2018')
        },
        u0,
        [
          tag0
        ]).save();


        await taskFactory({
          name: 'task1',
          start: Date.parse('04 05 2018'),
          end: Date.parse('06 07 2018')
        },
        u0,
        [
          tag0
        ]).save();

        const tasks = await Task.find({
          user_id: u0,
          tags: { $all: [tag0.id] }
        });

        expect(tasks.length).to.eq(2);
        expect(tasks[0].name).to.eq('task0');
        expect(Date.parse(tasks[0].start)).to.eq(1520107200000);
        expect(tasks[1].name).to.eq('task1');
        expect(Date.parse(tasks[1].end)).to.eq(1528315200000);
      });

      it('should be found with user and tag names', async () => {
        const u1 = await userFactory({ email: 'a@b.com' }).save();
        const tag0 = await tagFactory({ name: 'u1Tag' }, u1).save();
        const tag1 = await tagFactory({ name: 'u2Tag' }, u1).save();
        const tag2 = await tagFactory({ name: 'u3Tag' }, u1).save();

        await taskFactory({
          name: 'task1',
          start: Date.parse('04 05 2018'),
          end: Date.parse('06 07 2018')
        },
        u1,
        [
          tag0,
          tag1
        ]).save();

        await taskFactory({
          name: 'task2',
          start: Date.parse('08 09 2018'),
          end: Date.parse('10 11 2018')
        },
        u1,
        [
          tag0,
          tag1
        ]).save();

        await taskFactory({
          name: 'task3',
          start: Date.parse('11 12 2018'),
          end: Date.parse('01 02 2019')
        },
        u1,
        [
          tag0,
          tag2
        ]).save();

        const tasks = await Task.find({
          user_id: u1,
          tags: { $all: [tag0.id, tag1.id] }
        });

        expect(tasks.length).to.eq(2);
        expect(tasks[0].name).to.eq('task1');
        expect(tasks[1].name).to.eq('task2');
      });

      it('should be found with user and time period', async () => {
        const u2 = await userFactory({ email: 'b@c.com' }).save();

        await taskFactory({
          name: 'task4',
          start: Date.parse('02 02 2018'),
          end: Date.parse('02 02 2018')
        },
        u2, []).save();

        await taskFactory({
          name: 'task5',
          start: Date.parse('02 02 2018'),
          end: Date.parse('02 02 2018')
        },
        u2, []).save();

        await taskFactory({
          name: 'task5',
          start: Date.parse('04 04 2018'),
          end: Date.parse('04 04 2018')
        },
        u2, []).save();

        const tasks = await Task.find({
          start: { $gt: Date.parse('02 01 2018') },
          end: { $lt: Date.parse('02 03 2018') },
          user_id: u2
        });

        expect(tasks.length).to.eq(2);
        expect(tasks[0].name).to.eq('task4');
        expect(tasks[1].name).to.eq('task5');
      });
    });

    describe('#create', () => {
      it('should not fail on duplicate records', async () => {
        const u3 = await userFactory({ email: 'c@d.com' }).save();

        await taskFactory({
          name: 'task6',
          start: Date.parse('02 02 2018'),
          end: Date.parse('02 02 2018')
        },
        u3, []).save();

        await taskFactory({
          name: 'task6',
          start: Date.parse('02 02 2018'),
          end: Date.parse('02 02 2018')
        },
        u3, []).save();

        const tasks = await Task.find({
          user_id: u3
        });
        expect(tasks.length).to.eq(2);
        expect(tasks[0].name).to.eq('task6');
        expect(tasks[1].name).to.eq('task6');
      });
    });

    describe('#update', () => {
      it('should not fail', async () => {
        const u4 = await userFactory({ email: 'e@f.com' }).save();

        await taskFactory({
          name: 'task7',
          start: Date.parse('03 03 2018'),
          end: Date.parse('03 03 2018')
        },
        u4, []).save();

        await taskFactory({
          name: 'task0',
          start: Date.parse('04 03 2018'),
          end: Date.parse('04 03 2018')
        },
        u4, []).save();

        const task = await Task.findOne({ name: 'task7' });
        task.name = 'task8';

        let err;
        try {
          await task.save();
        }
        catch (e) {
          err = e;
        }
        expect(err).to.eq(undefined);
        expect(await Task.count({})).to.eq(2);

        const taskUpdated = await Task.findOne({ _id: task.id });
        expect(taskUpdated.name).to.eq('task8');

        const taskNotUpdated = await Task.find({ _id: { $ne: task.id } });
        expect(taskNotUpdated.length).to.eq(1);
        expect(taskNotUpdated[0].name).to.eq('task0');
      });
    });

    describe('#destroy', () => {
      it('should not fail', async () => {
        const u4 = await userFactory({ email: 'e@f.com' }).save();

        const t0 = await taskFactory({
          name: 'task8',
          start: Date.parse('03 03 2018'),
          end: Date.parse('03 03 2018')
        },
        u4, []).save();

        await taskFactory({
          name: 'task9',
          start: Date.parse('04 03 2018'),
          end: Date.parse('04 03 2018')
        },
        u4, []).save();


        let err;
        try {
          await Task.remove({ _id: t0.id });
        }
        catch (e) {
          err = e;
        }
        expect(err).to.eq(undefined);
        expect(await Task.count()).to.eq(1);
        expect((await Task.find({}))[0].name).to.eq('task9');
      });
    });
  });
});
