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
   * @throws FieldValidationError
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
      this.handleError(error, options, timeStart, message)
    }
  }

  /**
   * @param {Object} error
   * @param {Object} options
   * @param {Date} timeStart
   * @param {string} message
   *
   * @throws FieldValidationError
   * @throws UnauthorizedError
   * @throws MagentoEndpointNotFoundError
   * @throws MagentoEndpointNotAllowedError
   * @throws MagentoEndpointError
   * @throws UnknownError
   */
  handleError (error, options, timeStart, message) {
    const statusCode = _.get('error.response.statusCode')
    if (statusCode && [401, 403, 404, 405].includes(statusCode)) {
      if (statusCode === 401 || statusCode === 403) {
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'UnauthorizedError')
        throw new UnauthorizedError()
      } else if (statusCode === 404) {
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'MagentoEndpointNotFoundError')
        throw new MagentoEndpointNotFoundError()
      } else if (statusCode === 405) {
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'MagentoEndpointNotAllowedError')
        throw new MagentoEndpointNotAllowedError()
      }
    } else if (error.error && error.response) {
      this.log(error.response, util.inspect(options, true, 5), timeStart, 'MagentoEndpointError')
      throw new MagentoEndpointError()
    } else {
      this.log(_.get('error.response', {}), util.inspect(options, true, 5), timeStart, _.get('error.message', ''))
      throw new UnknownError()
    }
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
        statusCode: _.get('response.statusCode', 0),
        request,
        response:
          {
            headers: _.get('response.headers', {}),
            body: _.get('response.body', {})
          }
      },
      message
    )
  }
}

module.exports = Request
