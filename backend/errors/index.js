const CustomAPIError = require('./custom-api')
const Unauthenticated = require('./unauthenticated')
const NotFound = require('./not-found')
const BadRequest = require('./bad-request')

module.exports = {
  CustomAPIError,
  Unauthenticated,
  NotFound,
  BadRequest,
};