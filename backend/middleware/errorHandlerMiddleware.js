const { StatusCodes } = require('http-status-codes');
const {CustomAPIError} = require('../errors');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message ||'Something went wrong try again later',
  };

  if (err.name === 'ValidationError'){
    //console.log(Object.values(err.errors));
    customError.message = Object.values(err.errors).map((item) =>item.message).join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if(err.code && err.code === 11000){
    customError.message = `Dublicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if(err.name === 'CastError'){
    customError.message = `No item found with id: ${err.value}`
    ccustomError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err instanceof CustomAPIError) {
      return res.status(err.statusCode).json({ message: err.message })
    }
  return res.status(customError.statusCode).json({ message: customError.message});
};

module.exports = errorHandlerMiddleware;