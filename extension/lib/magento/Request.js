const MagentoEndpointNotFoundError = require('./errors/EndpointNotFound')
const MagentoEndpointNotAllowedError = require('./errors/EndpointNotAllowed')
const MagentoEndpointError = require('./errors/Endpoint')
const UnauthorizedError = require('../shopgate/errors/UnauthorizedError')
const UnknownError = require('../shopgate/errors/UnknownError')
const util = require('util')
const _ = {
  get: require('lodash/get')
}

/**
 * All needed methods to fire requests to magento
 */
class Request {
  /**
   * @param {StepContext} context
   * @param {string} token
   */
  constructor (context, token) {
    this.logger = context.log
    this.request = context.tracedRequest('magento-favorites-extension:request', { log: true }).defaults({
      auth: {
        bearer: token
      },
      rejectUnauthorized: !context.config.allowSelfSignedCertificate,
      resolveWithFullResponse: true
    })
  }

  /**
   * @param {string} url
   * @param {string} message
   * @param {string} method
   * @param {Object | boolean} data
   * @returns {Object}
   *
   * @throws UnauthorizedError
   * @throws MagentoEndpointNotFoundError
   * @throws MagentoEndpointNotAllowedError
   * @throws MagentoEndpointError
   * @throws UnknownError
   */
  async send (url, message = 'Request to Magento', method = 'GET', data = true) {
    const options = {
      url: url,
      method: method,
      json: data
    }
    const timeStart = new Date()

    try {
      const response = await this.request(options)
      this.log(response, util.inspect(options, true, 5), timeStart, message)
      return response.body
    } catch (error) {
      this.handleError(error, options, timeStart)
    }
  }

  /**
   * @param {Object} error
   * @param {Object} options
   * @param {Date} timeStart
   *
   * @throws UnauthorizedError
   * @throws MagentoEndpointNotFoundError
   * @throws MagentoEndpointNotAllowedError
   * @throws MagentoEndpointError
   * @throws UnknownError
   */
  handleError (error, options, timeStart) {
    const statusCode = _.get(error, 'response.statusCode', 0)
    const parsedOptions = util.inspect(options, true, 5)
    if (statusCode && statusCode >= 400) {
      switch (statusCode) {
        case 401:
        case 403:
          this.log(error.response, parsedOptions, timeStart, 'UnauthorizedError')
          throw new UnauthorizedError()
        case 404:
          this.log(error.response, parsedOptions, timeStart, 'MagentoEndpointNotFoundError')
          throw new MagentoEndpointNotFoundError()
        case 405:
          this.log(error.response, parsedOptions, timeStart, 'MagentoEndpointNotAllowedError')
          throw new MagentoEndpointNotAllowedError()
        default:
          this.log(error.response || {}, parsedOptions, timeStart, 'MagentoEndpointError')
          throw new MagentoEndpointError()
      }
    }
    this.log(error.response || {}, parsedOptions, timeStart, error.message || '')
    throw new UnknownError()
  }

  /**
   * @param {Object} response
   * @param {Object} request
   * @param {Date} timerStart
   * @param {string} message
   */
  log (response, request, timerStart, message) {
    this.logger.debug(
      {
        duration: new Date() - timerStart,
        statusCode: _.get(response, 'statusCode', 0),
        request,
        response:
          {
            headers: _.get(response, 'headers', {}),
            body: _.get(response, 'body', {})
          }
      },
      message
    )
  }
}

module.exports = Request
