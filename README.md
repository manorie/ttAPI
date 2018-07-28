# ttAPI

[![Build Status](https://travis-ci.org/manorie/ttAPI.svg?branch=master)](https://travis-ci.org/manorie/ttAPI)
[![Coverage Status](https://coveralls.io/repos/github/manorie/ttAPI/badge.svg?branch=master&c=1)](https://coveralls.io/github/manorie/ttAPI?branch=master)

- jobs -> M
  _id
  user: User
  title: String
  tags: [id0, id1]
  timeStart: x
  timeEnd: y

- tags -> N
  _id
  user: User
  title: String

- models
  - USERS -> name, email, password
  - TAGS -> name
  - JOBS -> name, tag, start, end (ut)

- controllers
  - AUTH
  - USER
  - TAG
  - JOB