const assert = require('assert')
const request = require('request-promise-native')
const nock = require('nock')

const MagentoRequest = require('../../../../lib/magento/Request')
const UnauthorizedError = require('../../../../lib/shopgate/errors/UnauthorizedError')
const EndpointNotFound = require('../../../../lib/magento/errors/EndpointNotFound')
const EndpointNotAllowed = require('../../../../lib/magento/errors/EndpointNotAllowed')
const EndpointError = require('../../../../lib/magento/errors/Endpoint')
const UnknownError = require('../../../../lib/shopgate/errors/UnknownError')

describe('magento: Request class', () => {
  /**
   * @type {StepContext}
   */
  let context = {
    config: {
      allowSelfSignedCertificate: true
    },
    tracedRequest: () => request,
    log: {
      debug: (object, message) => {}
    }
  }
  const magentoUrl = 'http://localhost/shopgate/v2'
  const path = '/wishlists'
  let mageRequest = null
  beforeEach(() => {
    mageRequest = new MagentoRequest(context, 'testToken')
  })

  it('Returns proper Unauthorized error', async () => {
    nock(magentoUrl).get(path).reply(401, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof UnauthorizedError, 'Improper error returned'))
  })

  it('Returns proper Unauthorized error', async () => {
    nock(magentoUrl).get(path).reply(403, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof UnauthorizedError, 'Improper error returned'))
  })

  it('Returns proper 404 error', async () => {
    nock(magentoUrl).get(path).reply(404, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof EndpointNotFound, 'Improper error returned'))
  })

  it('Returns proper 405 error', async () => {
    nock(magentoUrl).get(path).reply(405, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof EndpointNotAllowed, 'Improper error returned'))
  })

  it('Returns proper 500 error', async () => {
    nock(magentoUrl).get(path).reply(500, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof EndpointError, 'Improper error returned'))
  })

  it('Returns unknown error for all other error cases', async () => {
    nock(magentoUrl).get(path).reply(100, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof UnknownError, 'Improper error returned'))
  })
})
