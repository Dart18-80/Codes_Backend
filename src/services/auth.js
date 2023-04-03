const jwt_decode = require('jwt-decode');


let authToken = (token) => {
    try{
        const withoutBearer = token.replace("Bearer ", "");
        const array_token = withoutBearer.split(".");

        if(array_token.length != 3) {
            return { message: "Invalid token.",  type: false, code: 500 };
        }
        
        var decoded = jwt_decode(token);

        if (!decoded.id && !decoded.name && !decoded.email) {
            return { message: "Invalid token.",  type: false, code: 500 };
        }
        
        return {message: "Valid token.",  type: true, code: 200, id: decoded.id};
    }
    catch(err){
        return {message: "Valid token.",  type: true, code: 200, id: decoded.id};
    }
};

module.exports = authToken;