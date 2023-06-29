const jwt = require('jsonwebtoken');
//const config = require('../config/config');
const config = {
    secret_jwt: "thisissecretkey"
  };
const verifyToken = async (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers["authorization"];
    
    if(!token){
        res.status(200).send({success: false, message:"a token is required for authentication."});
    }
    try {
        const decode = jwt.verify(token,config.secret_jwt);
        req.user = decode;
    }
    catch(error){
        res.status(400).send("Invalid Token");
    }
    return next();

}

module.exports =  verifyToken;