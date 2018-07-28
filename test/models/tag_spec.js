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

const { Tag } = require('../../models/tag');
const { User } = require('../../models/user');

describe('models_tag', () => {
  before(async () => {
    await User.create(
      {
        name: 'u0',
        email: 'u0@example.com',
        password: 'x'
      }
    );
  });

  after(async () => {
    await User.remove({});
  });

  describe('validation', () => {
    it('raises an error with empty name', async () => {
      const u0 = await User.findOne({ email: 'u0@example.com' });

      const t0 = new Tag({
        name: '',
        _user: u0
      });

      let err;
      try {
        await t0.save();
      }
      catch (e) {
        err = e;
      }
      expect(await Tag.count()).to.eq(0);
      expect(err.message).to.contain('name is required');
    });

    it('raises an error with empty user', async () => {
      const t1 = new Tag({
        name: 'tag0'
      });

      let err;
      try {
        await t1.save();
      }
      catch (e) {
        err = e;
      }
      expect(await Tag.count()).to.eq(0);
      expect(err.message).to.contain('user is required');
    });
  });

  describe('persistance', () => {
    before(async () => {
      await User.create(
        {
          name: 'u1',
          email: 'u1@example.com',
          password: 'y'
        }
      );
      const u1 = await User.findOne({ email: 'u1@example.com' });

      await Tag.create({
        name: 'dumyTag0',
        _user: u1._id
      });
    });

    after(async () => {
      await Tag.remove({});
      await User.remove({});
    });

    describe('#find', () => {
      it('should find tag with name and/or user', async () => {
        expect(await Tag.count()).to.eq(1);

        const u1 = await User.findOne({ email: 'u1@example.com' });
        const t0 = await Tag.find({
          name: 'dumyTag0',
          _user: u1
        });

        expect(t0.length).to.eq(1);
        expect(t0[0].get('name')).to.eq('dumyTag0');

        const t1 = await Tag.find({
          _user: u1
        });

        expect(t1.length).to.eq(1);
        expect(t0[0].get('name')).to.eq('dumyTag0');
      });

      it('should find tags of user', async () => {
        expect(await Tag.count()).to.eq(1);

        const u1 = await User.findOne({ email: 'u1@example.com' });
        await Tag.create(
          {
            name: 'dumyTag1',
            _user: u1._id
          },
          {
            name: 'dumyTag2',
            _user: u1._id
          }
        );

        const t2 = await Tag.find({
          _user: u1
        });

        expect(t2.length).to.eq(3);
        expect(t2[0].get('name')).to.eq('dumyTag0');
        expect(t2[1].get('name')).to.eq('dumyTag1');
        expect(t2[2].get('name')).to.eq('dumyTag2');
      });
    });

    describe('#create and #destroy a tag', () => {

    });

    describe('#create second tag for same user', () => {

    });

    describe('#create same tag for different user', () => {

    });
  });
});
