const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "dARtlop8qWZSeVh6asyOxc103rPk2T5j"; 

exports.createAccessToken = function(user) {
    const payload = {
        id: user.Id_User,
        name: user.Name,
        email: user.Email,
        createToken: moment().unix(),
        exp: moment().add(3, "hours").unix()
    };
    
    return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = function(user) {
    const payload = {
        id:user.Id_User,
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};

exports.decodedToken = function(token) {
    return jwt.decode(token, SECRET_KEY, true);
};