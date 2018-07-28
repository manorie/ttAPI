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
        name: 'dummyTag0',
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
          name: 'dummyTag0',
          _user: u1
        });

        expect(t0.length).to.eq(1);
        expect(t0[0].get('name')).to.eq('dummyTag0');

        const t1 = await Tag.find({
          _user: u1
        });

        expect(t1.length).to.eq(1);
        expect(t0[0].get('name')).to.eq('dummyTag0');
      });

      it('should find tags of user', async () => {
        expect(await Tag.count()).to.eq(1);

        const u1 = await User.findOne({ email: 'u1@example.com' });
        await Tag.create(
          {
            name: 'dummyTag1',
            _user: u1._id
          },
          {
            name: 'dummyTag2',
            _user: u1._id
          }
        );

        const t2 = await Tag.find({
          _user: u1
        });

        expect(t2.length).to.eq(3);
        expect(t2[0].get('name')).to.eq('dummyTag0');
        expect(t2[1].get('name')).to.eq('dummyTag1');
        expect(t2[2].get('name')).to.eq('dummyTag2');
      });
    });

    describe('#create and #destroy a tag', () => {
      it('should not fail', async () => {
        await Tag.remove({});
        expect(await Tag.count()).to.eq(0);

        const u2 = await User.findOne({ email: 'u1@example.com' });

        let err;
        try {
          await Tag.create({
            name: 'dummyTag3',
            _user: u2
          });
        }
        catch (e) {
          err = e;
        }
        expect(err).to.eq(undefined);
        expect(await Tag.count()).to.eq(1);

        const t0 = await Tag.findOne({ name: 'dummyTag3' });
        expect(t0.get('name')).to.eq('dummyTag3');

        // add one more tag to see if the right tag is destroyed
        await Tag.create({
          name: 'dummyTag4',
          _user: u2
        });
        expect(await Tag.count()).to.eq(2);
        const { ok } = await Tag.remove({ name: 'dummyTag3', _user: u2 });
        expect(ok).to.eq(1);
        expect(await Tag.count()).to.eq(1);

        const [t1] = await Tag.find({ _user: u2 });
        expect(t1.get('name')).to.eq('dummyTag4');
      });
    });

    describe('#create second tag for same user', () => {
      it('should not be a created and raise an error', async () => {
        const u3 = await User.findOne({ email: 'u1@example.com' });

        await Tag.create({
          name: 'dummyTag5',
          _user: u3
        });
        expect(await Tag.count()).to.eq(2);

        let err;
        try {
          await Tag.create({
            name: 'dummyTag5',
            _user: u3
          });
        }
        catch (e) {
          err = e;
        }
        expect(err.message).to.contain('dup key');
        expect(await Tag.count()).to.eq(2);
      });
    });

    describe('#create same tag for different user', () => {
      it('should not fail', async () => {
        await User.remove({});
        await Tag.remove({});

        await User.create(
          {
            name: 'u2',
            email: 'u2@example.com',
            password: 'hashedPassword'
          },
          {
            name: 'u3',
            email: 'u3@example.com',
            password: 'hashedPassword'
          },
        );
        expect(await User.count()).to.eq(2);
        expect(await Tag.count()).to.eq(0);


        const u1 = await User.findOne({ email: 'u2@example.com' });
        const u2 = await User.findOne({ email: 'u3@example.com' });

        let err;
        try {
          await Tag.create({
            name: 'dummyTag6',
            _user: u1
          });

          await Tag.create({
            name: 'dummyTag6',
            _user: u2
          });
        }
        catch (e) {
          err = e;
        }

        expect(err).to.eq(undefined);
        const [t0, t1] = await Tag.find({});
        expect(t0.get('name')).to.eq('dummyTag6');
        expect(t1.get('name')).to.eq('dummyTag6');
        expect(t0._user).to.not.eq(t1._user);
      });
    });
  });
});
