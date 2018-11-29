"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        it("should get undefined on non existing User", function () {
            // TODO
        });
    });
    describe("#save", function () {
        it("should save a User", function () {
            // TODO
        });
        it("should update a User", function () {
            // TODO
        });
    });
    describe("#delete", function () {
        it("should delete a User", function () {
            // TODO
        });
        it("should not fail if User does not exist", function () {
            // TODO
        });
    });
});
