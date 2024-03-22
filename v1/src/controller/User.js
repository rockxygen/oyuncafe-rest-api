const httpStatus = require("http-status");
const { _getAll, _getUser, _updateUser } = require("../services/User");
const { _checkUsername } = require("../services/Auth");


const index = (req, res) => {
    res.status(httpStatus.OK).send("User Index");
}

const getAll = (req, res, next) => {
    _getAll().then((resp) => {
        res.status(httpStatus.OK).jsonp(resp);
    }).catch((e) => res.status(httpStatus.BAD_REQUEST).jsonp(e));
}

const checkUsername = (req, res) => {
    _checkUsername(req.body.username).then((resp) => {
        res.status(httpStatus.OK).jsonp(resp);
    }).catch((e) => res.status(httpStatus.BAD_REQUEST).jsonp(e));
}

const getUser = (req, res, next) => {
    _getUser(req.params.username).then((resp) => {
        res.status(httpStatus.OK).jsonp(resp);
    }).catch((e) => res.status(httpStatus.BAD_REQUEST).jsonp(e));
}

const updateUser = (req, res) => {
    _updateUser(req.params.username, req.body).then((resp) => {
        res.status(httpStatus.OK).jsonp(resp);
    }).catch((e) => res.status(httpStatus.BAD_REQUEST).jsonp(e));
}

module.exports = {
    index,
    getAll,
    getUser,
    checkUsername,
    updateUser
}