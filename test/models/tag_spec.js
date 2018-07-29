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
  beforeEach(async () => {
    await Tag.remove({});
    await User.remove({});
  });

  describe('validation', () => {
    it('raises an error with empty name', async () => {
      const t0 = tagFactory({ name: '' }, { _user: await userFactory() });

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

        await tagFactory({ name: 'dummyTag1' }, user.id).save();
        expect(await Tag.count()).to.eq(1);

        const tag = await Tag
          .find({ name: 'dummyTag1', _user: user.id });
        expect(tag).to.be.a('array');
        expect(tag.length).to.eq(1);

        const [userOnTag] = await User.find({ _id: tag[0]._user._id });
        expect(userOnTag.id).to.be.eq(user.id);
        expect(userOnTag.email).to.eq('x@y.com');

        expect(await User.count()).to.eq(1);
        expect(await Tag.count()).to.eq(1);
      });

      it('should find tags of user', async () => {
        await userFactory({ email: 'z@a.com' }).save();
        await userFactory({ email: 'b@c.com' }).save();
        expect(await User.count()).to.eq(2);

        const user0 = await User.findOne({ email: 'b@c.com' });
        const user1 = await User.findOne({ email: 'z@a.com' });
        await tagFactory({ name: 'dummyTag2' }, user0.id).save();
        await tagFactory({ name: 'dummyTag3' }, user0.id).save();
        await tagFactory({ name: 'dummyTag4' }, user1.id).save();
        expect(await Tag.count()).to.eq(3);

        const tags = await Tag.find({ _user: user0.id });
        expect(tags.length).to.eq(2);

        expect(tags[0].name).to.eq('dummyTag2');
        expect(tags[1].name).to.eq('dummyTag3');
      });
    });

    describe('#create and #destroy a tag', () => {
      it('should not fail', async () => {
        await userFactory({ email: 'c@d.com' }).save();
        const user2 = await User.findOne({ email: 'c@d.com' });

        let err;
        try {
          await tagFactory({ name: 'dummyTag5' }, user2.id).save();
          await tagFactory({ name: 'dummyTag6' }, user2.id).save();
        }
        catch (e) {
          err = e;
        }
        expect(err).to.eq(undefined);
        expect(await Tag.count()).to.eq(2);

        const t = await Tag.findOne({ name: 'dummyTag5' }).populate('_user');
        expect(t.get('_user.id')).to.eq(user2.id);

        try {
          await Tag.remove({ name: 'dummyTag5', _user: user2.id });
        }
        catch (e) {
          err = e;
        }
        expect(err).to.eq(undefined);
        expect(await Tag.count()).to.eq(1);

        const tag6 = await Tag.findOne({ name: 'dummyTag6', _user: user2.id });
        expect(tag6.get('name')).to.eq('dummyTag6');
      });
    });

    describe('#create second present tag for same user', () => {
      it('should not be a created and raise an error', async () => {
        await userFactory({ email: 'e@f.com' }).save();
        const user3 = await User.findOne({ email: 'e@f.com' });

        await tagFactory({ name: 'dummyTag7' }, user3.id).save();
        expect(await Tag.count()).to.eq(1);

        let err;
        try {
          await tagFactory({ name: 'dummyTag7' }, user3.id).save();
        }
        catch (e) {
          err = e;
        }
        expect(err.message).to.contain('duplicate key');
        expect(await Tag.count()).to.eq(1);
      });
    });

    describe('#create same tag for different user', () => {
      it('should not fail', async () => {
        await userFactory({ email: 'f@g.com' }).save();
        await userFactory({ email: 'h@j.com' }).save();
        const user4 = await User.findOne({ email: 'f@g.com' });
        const user5 = await User.findOne({ email: 'h@j.com' });
        expect(await User.count()).to.eq(2);

        expect(user4.id).to.not.eq('');
        expect(user5.id).to.not.eq('');
        expect(user4.id).to.not.eq(user5.id);


        await tagFactory({ name: 'dummyTag7' }, user4.id).save();
        expect(await Tag.count()).to.eq(1);

        await tagFactory({ name: 'dummyTag7' }, user5.id).save();
        expect(await Tag.count()).to.eq(2);
      });
    });
  });
});
