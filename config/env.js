const mongoURI = () => {
  switch (process.env.NODE_ENV) {
    case 'production': {
      return process.env.MONGODB_URI;
    }
    case 'test': {
      return process.env.MONGODB_TEST_URI;
    }
    default: {
      return process.env.MONGODB_DEV_URI;
    }
  }
};

module.exports = {
  port: process.env.PORT || 9123,
  mongoURI: mongoURI()
};
