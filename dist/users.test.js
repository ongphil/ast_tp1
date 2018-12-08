"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const users_1 = require("./users");
const leveldb_1 = require("./leveldb");
const dbPath = "db_test/users";
var dbUser;
describe("Users", function () {
    before(function () {
        leveldb_1.LevelDb.clear(dbPath);
        dbUser = new users_1.UserHandler(dbPath);
    });
    after(function () {
        dbUser.db.close();
    });
    describe("#get", function () {
        it("should get undefined on non existing User", function (done) {
            dbUser.get("user", (err, result) => {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.be.undefined;
                done();
            });
        });
    });
    describe("#save", function () {
        it("should save a User", function (done) {
            const user = new users_1.User("user100", "user100@test.com", "user100");
            dbUser.save(user, function (err) {
                chai_1.expect(err).to.be.undefined;
                dbUser.get("user100", (err2, result) => {
                    chai_1.expect(err2).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    done();
                });
            });
        });
        it("should update a User", function (done) {
            const user = new users_1.User("user100", "user100@test.com", "user100");
            dbUser.save(user, function (err) {
                chai_1.expect(err).to.be.undefined;
                dbUser.get("user100", (err2, result2) => {
                    chai_1.expect(err2).to.be.null;
                    chai_1.expect(result2).to.not.be.undefined;
                    done();
                });
            });
        });
    });
    describe("#delete", function () {
        before(function () {
            const user = new users_1.User("user200", "user200@test.com", "user200");
            dbUser.save(user, function (err) {
                chai_1.expect(err).to.be.undefined;
            });
        });
        it("should delete a User", function (done) {
            dbUser.delete("user200", function (err) {
                chai_1.expect(err).to.be.undefined;
                dbUser.get("user200", (err, result) => {
                    chai_1.expect(err).to.be.null;
                    chai_1.expect(result).to.be.undefined;
                    done();
                });
            });
        });
        it("should not fail if User does not exist", function (done) {
            dbUser.delete('user230', function (err) {
                chai_1.expect(err).to.be.undefined;
                done();
            });
        });
    });
});
