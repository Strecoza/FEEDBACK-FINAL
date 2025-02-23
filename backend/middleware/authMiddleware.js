const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Unauthenticated} = require('../errors');

const authMiddleware = (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new Unauthenticated('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user to the job routes
        req.user = {userId:payload.userId, username:payload.username};
        next();
    } catch (error) {
        throw new Unauthenticated('Authentication invalid');
    }
}

module.exports = authMiddleware;