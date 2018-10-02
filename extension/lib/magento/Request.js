const MagentoEndpointNotFoundError = require('./errors/EndpointNotFound')
const MagentoEndpointNotAllowedError = require('./errors/EndpointNotAllowed')
const MagentoEndpointError = require('./errors/Endpoint')
const UnauthorizedError = require('../shopgate/errors/UnauthorizedError')
const util = require('util')

/**
 * All needed methods to fire requests to magento
 */
class Request {
  /**
   * @param {string} url
   * @param {Object} context
   * @param {string} token
   * @param {string} message
   * @param {string} method - GET, POST, DELETE (don't use PUT with Magento)
   * @returns {Object}
   */
  static async send (url, context, token, method = 'GET', message = 'Request to Magento: getWishlists') {
    const options = {
      url,
      method,
      json: true,
      rejectUnauthorized: !context.config.allowSelfSignedCertificate,
      auth: {
        bearer: token
      }
    }

    const tracedRequest = context.tracedRequest('magento-favorite-extension:MagentoRequest', { log: true })
    this.context = context

    return new Promise((resolve, reject) => {
      tracedRequest(
        options,
        (error, response) => {
          this.response = null
          if (response) {
            this.response = response
          }

          if (error) {
            this.log(null, util.inspect(options, true, 5), new Date(), message)
            reject(new Error(error))
          } else if (response.statusCode === 401 || response.statusCode === 403) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'UnauthorizedError')
            reject(new UnauthorizedError())
          } else if (response.statusCode === 404) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'MagentoEndpointNotFoundError')
            reject(new MagentoEndpointNotFoundError())
          } else if (response.statusCode === 405) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'MagentoEndpointNotAllowedError')
            reject(new MagentoEndpointNotAllowedError())
          } else if (response.body && response.body.messages && response.body.messages.error) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'MagentoEndpointError')
            reject(new MagentoEndpointError())
          } else { // This else is currently important, cause there is a bug within the tracedRequest which will crash the app otherwise
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), message)
            resolve(response.body)
          }
        })
    })
  }

  static log (statusCode, request, timerStart, message) {
    this.context.log.debug(
      {
        duration: new Date() - timerStart,
        statusCode,
        request,
        response:
          {
            headers: this.response.headers,
            body: this.response.body
          }
      },
      message
    )
  }
}

module.exports = Request
