const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Unauthenticated} = require('../errors');

const authMiddleware = (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'Authentication invalid: Has no token'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user to request
        req.user = {userId:payload.userId, username:payload.username};
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Authentication invalid: Token invalid'});
    }
}

module.exports = authMiddleware;