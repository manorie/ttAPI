# ttAPI

[![Build Status](https://travis-ci.org/manorie/ttAPI.svg?branch=master)](https://travis-ci.org/manorie/ttAPI)
[![Coverage Status](https://coveralls.io/repos/github/manorie/ttAPI/badge.svg?branch=master&c=1)](https://coveralls.io/github/manorie/ttAPI?branch=master)


Install MongoDB and,

running tests,

> NODE_ENV=test MONGODB_TEST_URI=mongodb://127.0.0.1:27017/ttAPI_test yarn run tdd

running dev env,

> NODE_ENV=dev MONGODB_DEV_URI=mongodb://127.0.0.1:27017/ttAPI_dev yarn run dev


**Notes**

- controllers
  - USER
    - register
    - me
  - AUTH
    - login
  - TAG
    - tags
  - TASK
    - create
    - update
    - delete
    - tasks