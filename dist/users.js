"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leveldb_1 = require("./leveldb");
class User {
    constructor(username, email, password, passwordHashed = false) {
        this.password = "";
        this.username = username;
        this.email = email;
        if (!passwordHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    setPassword(toSet) {
        // Hash and set password
        this.password = toSet;
    }
    getPassword() {
        return this.password;
    }
    validatePassword(toValidate) {
        return this.password === toValidate;
    }
    static fromDb(username, value) {
        const [password, email] = value.split(":");
        return new User(username, email, password);
    }
}
exports.User = User;
class UserHandler {
    constructor(path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
    get(username, callback) {
        this.db.get(`user:${username}`, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            else
                callback(null, User.fromDb(username, data));
        });
    }
    save(user, callback) {
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err) => {
            callback(err);
        });
    }
    delete(username, callback) {
        this.db.del(`user:${username}`, (err) => {
            callback(err);
        });
    }
}
exports.UserHandler = UserHandler;
