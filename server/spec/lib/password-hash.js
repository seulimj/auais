'use strict';
let yi = require('yibit');
let passwordHash = yi.passwordHash;
describe('password-hash', function () {

    let hash123456;
    let anotherHash123456;

    it('哈希密码时不应出错', function (done) {
        passwordHash.hash('123456', function (err, hash) {
            hash123456 = hash;
            expect(err).toBeFalsy();
            done();
        });
    });
    it('比较字符串123456和其密文,二者应该对应', function (done) {
        passwordHash.compare('123456', hash123456, function (err, result) {
            expect(result).toBe(true);
            done();
        });
    });
    it('对同一个字符串（即123456）哈希两次得到的结果应该不同', function (done) {
        passwordHash.hash('123456', function (err, hash) {
            anotherHash123456 = hash;
            expect(anotherHash123456).not.toBe(hash123456);
            done();
        });
    });
    it('比较字符串123456和其另一个密文,二者也应该对应', function (done) {
        passwordHash.compare('123456', hash123456, function (err, result) {
            expect(result).toBe(true);
            done();
        });
    });
});
