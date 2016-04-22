'use strict';
module.exports = new Map([
  ['unknownError', {code: 0, status: 500}],
  ['notFound', {code: 1, status: 404}],
  ['unauthorized', {code: 2, status: 401}],
  ['badRequest', {code: 3, status: 400}],
  ['invalidRequest', {code: 4, status: 400}],
  ['cryptoError', {code: 5, status: 400}],
  ['mongoError', {code: 6, status: 500}],
  ['redisError', {code: 7, status: 500}],
  ['notExist', {code: 8, status: 400}],
  ['invalidPassword', {code: 9, status: 400, message: '密码无效'}]
]);