import { expect } from "chai";
import { User, UserHandler } from "./users";
import { LevelDb } from "./leveldb";

const dbPath: string = "db_test/users";
var dbUser: UserHandler;

describe("Users", function() {
  before(function() {
    LevelDb.clear(dbPath);
    dbUser = new UserHandler(dbPath);
  });

  after(function() {
    dbUser.db.close();
  });

  describe("#get", function() {
    it("should get undefined on non existing User", function(done) {
      dbUser.get("user", (err: Error | null, result?: User) => {
        expect(err).to.be.null;
        expect(result).to.be.undefined;
        done();
      });
    });
  });

  describe("#save", function() {

    it("should save a User", function(done) {
      const user = new User("user100", "user100@test.com", "user100");
      dbUser.save(user, function (err: Error | null) {
        expect(err).to.be.undefined;
        dbUser.get("user100", (err2, result) => {
          expect(err2).to.be.null;
          expect(result).to.not.be.undefined;
          done();
        });
      });
    });

    it("should update a User", function(done) {
        const user = new User("user100", "user100@test.com", "user100");
        dbUser.save(user, function (err: Error | null) {
          expect(err).to.be.undefined;
          dbUser.get("user100", (err2, result2) => {
            expect(err2).to.be.null;
            expect(result2).to.not.be.undefined;
            done();
          });
        });
    });

  });

  describe("#delete", function() {

    before(function() {
      const user = new User("user200", "user200@test.com", "user200");
      dbUser.save(user, function (err: Error | null) {
        expect(err).to.be.undefined;
      });
    });

    it("should delete a User", function(done) {
      dbUser.delete("user200", function (err: Error | null) {
        expect(err).to.be.undefined;
        dbUser.get("user200", (err, result) => {
          expect(err).to.be.null;
          expect(result).to.be.undefined;
          done();
        });
      });
    });

    it("should not fail if User does not exist", function(done) {
      dbUser.delete('user230', function (err: Error | null) {
        expect(err).to.be.undefined;
        done();
      });
    });
  });
});
