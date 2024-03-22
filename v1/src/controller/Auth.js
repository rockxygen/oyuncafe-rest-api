const httpStatus = require("http-status");
const axios = require("axios");
const { connection } = require("../loaders/db");
const { hashPassword, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper");
const { _login, _register, _checkUsername } = require("../services/Auth");

const index = (req, res) => {
    res.status(200).send("Auth Index");
}

const login = (req, res) => {
    req.body.password = hashPassword(req.body.password);
    _login(req.body).then((user) => {
        if(user.length == 0){
            res.status(httpStatus.NOT_FOUND).jsonp({
                status: httpStatus.NOT_FOUND,
                message: user
            });
            return;
        }
        delete user[0].password;
        delete user[0].serial;
        user = {
            ...user[0],
            tokens: {
                access_token: generateAccessToken(user[0]),
                refresh_token: generateRefreshToken(user[0])
            }
        }
        res.status(httpStatus.OK).jsonp(user);
    });
}

const google = (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url);
    // console.log(url);
}

const callback = async (req, res) => {
    const { code } = req.query;

    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const { access_token, id_token } = data;

        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = {
            ...profile,
            tokens: {
                ...data
            }
        }

        res.status(httpStatus.OK).jsonp(user);
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/login');
    }
}

const facebook = (req, res) => {
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.APP_ID}&redirect_uri=${process.env.REDIRECT_URI2}&scope=email`;
    res.redirect(url);
}

const fbcallback = async (req, res) => {
    const { code } = req.query;

    try {
        const { data } = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&code=${code}&redirect_uri=${process.env.REDIRECT_URI2}`);

        const { access_token } = data;

        const { data: profile } = await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);

        const user = {
            ...profile,
            tokens: {
                ...data
            }
        }

        res.status(httpStatus.OK).jsonp(user);
    } catch (error) {
        console.error('Error:', error.response.data.error);
        res.redirect('/login');
    }
}

const register = (req, res) => {
    req.body.password = hashPassword(req.body.password);
    _checkUsername(req.body.username).then((resp) => {
        if(resp) {
            res.status(httpStatus.CONFLICT).jsonp({
                status: httpStatus.CONFLICT,
                message: "Böyle bir kullanıcı var."
            });
            return;
        }
        _register(req.body).then((resp) => {
            delete resp[0].password;
            delete resp[0].serial;
            // console.log(resp[0]);
            const user = {
                ...resp[0],
                tokens: {
                    access_token: generateAccessToken(resp[0]),
                    refresh_token: generateRefreshToken(resp[0])
                }
            }
            res.status(httpStatus.CREATED).jsonp(user);
        }).catch((e) => {
            const resp = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                ...e
            }
            res.status(httpStatus.INTERNAL_SERVER_ERROR).jsonp(resp);
        });
    });
}

const forgotPassword = (req, res) => {

}

const checkUsername = (req, res, next) => {
    const username = req.params.username == "" ? req.body.username : req.params.username;
    connection.query("select count(*) as user_exists from oyuncular where username = ?", username, (error, results, fields) => {
        if(error){
            res.status(httpStatus.BAD_REQUEST).jsonp(error);
            return;
        }
        delete results.pass;
        res.status(httpStatus.OK).jsonp({
            message: "success",
            status_code: httpStatus.OK,
            result: {
                exists: results[0].user_exists == 1 ? true : false
            }
        });
    });
}

const checkUserEmail = (req, res, next) => {
    console.log(req.params.useremail);
    const query = connection.query("select count(*) as count from oyuncular where email = ?", req.params.useremail, (error, results, fields) => {
        if(error){
            res.status(403).jsonp(error);
            return;
        }
        res.status(200).jsonp({
            message: "success",
            status_code: 200,
            result: {
                email_exists: results[0].count == 1 ? true : false
            }
        });
    });
    console.log(query.sql);
}

module.exports = {
    index,
    login,
    google,
    facebook,
    callback,
    fbcallback,
    register,
    forgotPassword,
    checkUsername,
    checkUserEmail
}