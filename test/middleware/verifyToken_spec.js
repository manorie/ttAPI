const jwt = require('jsonwebtoken');
const {
  expect
} = require('chai');
const {
  describe,
  it
} = require('mocha');

const { verifyToken } = require('../../middleware/verifyToken');

describe('middleware_verifyToken', () => {
  it('raises an error with empty token', async () => {
    let err;
    try {
      await verifyToken({ headers: {} }, 'secret0');
    }
    catch (e) {
      err = e;
    }
    expect(err.toString()).to.contain('token is not present');
  });

  it('raises an error with bad secret', async () => {
    const mockRequest = {
      headers: {
        'x-access-token': jwt.sign({ id: 'userID0' }, 'badSecret', {
          expiresIn: 86400
        })
      }
    };

    let err;
    try {
      await verifyToken(mockRequest, 'rightSecret');
    }
    catch (e) {
      err = e;
    }
    expect(err.toString()).to.contain('token verification failed');
  });

  it('raises an error when expired', async () => {
    const mockRequest = {
      headers: {
        'x-access-token': jwt.sign({
          // expired 1 hour ago
          exp: (Date.now() / 1000) - (60 * 60),
          id: 'userID1'
        }, 'rightSecret')
      }
    };

    let err;
    try {
      await verifyToken(mockRequest, 'rightSecret');
    }
    catch (e) {
      err = e;
    }
    expect(err.toString()).to.contain('token verification failed');
    expect(mockRequest.userID).to.eq(undefined);
  });

  it('sets userID on req with successful verification', async () => {
    const mockRequest = {
      headers: {
        'x-access-token': jwt.sign({
          // will expire in 1 hours
          exp: (Date.now() / 1000) + (60 * 60),
          id: 'userID2'
        }, 'rightSecret')
      }
    };

    let err;
    try {
      await verifyToken(mockRequest, 'rightSecret');
    }
    catch (e) {
      err = e;
    }
    expect(err).to.eq(undefined);
    expect(mockRequest.userID).to.eq('userID2');
  });
});
