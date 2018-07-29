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
const { tagFactory } = require('../factories/tag');
const { userFactory } = require('../factories/user');

describe('models_tag', () => {
  describe('validation', () => {
    it('raises an error with empty name', async () => {
      const t0 = tagFactory({ name: '' }, { _user: userFactory() });

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
      const t1 = tagFactory({ _user: undefined });

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
    beforeEach(async () => {
      await Tag.remove({});
      await User.remove({});
    });

    describe('#find', () => {
      it('should find tag with name and user', async () => {
        await userFactory({ email: 'x@y.com' }).save();
        expect(await User.count()).to.eq(1);

        const user = await User.findOne({ email: 'x@y.com' });
        expect(user).to.be.a('object');

        await tagFactory({ name: 'dummyTag1' }, user._id).save();
        expect(await Tag.count()).to.eq(1);

        const tag = await Tag.findOne({ name: 'dummyTag1' });
        expect(tag).to.be.a('object');
        const userFound = await User.findOne({ _id: tag.user });
        expect(userFound.id).to.be.eq(user.id);

        expect(await User.count()).to.eq(1);
        expect(await Tag.count()).to.eq(1);
      });

      it('should find tags of user', async () => {

      });
    });

    describe('#create and #destroy a tag', () => {
      it('should not fail', async () => {

      });
    });

    describe('#create second tag for same user', () => {
      it('should not be a created and raise an error', async () => {

      });
    });

    describe('#create same tag for different user', () => {
      it('should not fail', async () => {
      });
    });
  });
});
