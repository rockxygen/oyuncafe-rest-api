const httpStatus = require("http-status");
const { connection } = require("../loaders/db");

const insterData = (data) => {
    // const sql = connection.format("select * from ?? where ?? = ?", data);
    connection.query("select * from oyuncular where id = ?", data, (error, results, fields) => {
        if(error){
            return;
        }
        console.log(results);
        return results;
    });
}

const _login = (user) => {
    return new Promise((resolve, reject) => {
        connection.query(`select * from oyuncular where username = "${user.username}" and password = "${user.password}"`, (error, results, fields) => {
            if(error){
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

const _register = (user) => {
    const data = {
        serial: "",
        ...user
    }
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO oyuncular SET ?", data, (error, results, fileds) => {
            if(error){
                reject({
                    message: error.sqlMessage,
                    state: error.sqlState
                });
                return;
            }
            connection.query("select * from oyuncular where id = ?", results.insertId, (error, results, fields) => {
                if(error){
                    return;
                }
                resolve(results);
            });
        });
    });
}

const _checkUsername = (data) => {
    return new Promise((resolve, reject) => {
        connection.query("select * from oyuncular where username = ?", data, (error, results, fields) => {
            if(error){
                reject({
                    status: httpStatus.BAD_REQUEST,
                    message: error.sqlMessage,
                    state: error.sqlState
                });
                return;
            }
            resolve(results.length == 0 ? false : true);
        });
    });
}

const _checkEmail = (data) => {
    return new Promise((resolve, reject) => {
        connection.query("select * from oyuncular where email = ?", data, (error, results, fields) => {
            if(error){
                reject({
                    status: httpStatus.BAD_REQUEST,
                    message: error.sqlMessage,
                    state: error.sqlState
                });
                return;
            }
            resolve(results.length == 0 ? false : true);
        });
    });
}

module.exports = {
    _login,
    _register,
    _checkUsername,
    _checkEmail
}