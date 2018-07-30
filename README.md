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

- a job can have sub tasks
- when a job tagged / sub tasks tagged automatically
- when a sub task tagged differently / it get seperated from the jobs and 
becomes another job
- job groupping can be done on FE - jobs can will be singular

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