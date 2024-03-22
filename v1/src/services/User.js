const httpStatus = require("http-status");
const { connection } = require("../loaders/db")

const _getAll = () => {
    return new Promise((resolve, reject) => {
        connection.query("select * from oyuncular", (error, results, fields) => {
            if(error){
                reject({
                    message: error.sqlMessage,
                    state: error.sqlState
                });
                return;
            }
            if(results.length == 0){
                resolve({
                    count: 0
                });
                return;
            }
            results.map((user) => {
                delete user.password;
                delete user.serial;
            });
            const users = {
                status_code: httpStatus.OK,
                type: "list_users",
                status: "success",
                content: {
                    ...results
                }
            }
            resolve(users);
        });
    });
}

const _getUser = (data) => {
    return new Promise((resolve, reject) => {
        connection.query("select * from oyuncular where username = ?", data, (error, results, fileds) => {
            if(error){
                reject({
                    message: error.sqlMessage,
                    state: error.sqlState
                });
                return;
            }
            if(results.length == 0){
                resolve({
                    count: 0
                });
                return;
            }
            results.map((user) => {
                delete user.password;
                delete user.serial;
            });
            resolve(results);
        });
    });
}

const _updateUser = (username, data) => {
    return new Promise((resolve, reject) => {
        const test = connection.query("update oyuncular set ? where username = ?", [data, username], (error, results, fileds) => {
            if(error){
                reject({
                    message: error.sqlMessage,
                    state: error.sqlState
                });
                return;
            }
            resolve({
                status_code: httpStatus.OK,
                type: "updated_user",
                status: "success"
            });
        });
        console.log(test.sql);
    })
}

module.exports = {
    _getAll,
    _getUser,
    _updateUser
}