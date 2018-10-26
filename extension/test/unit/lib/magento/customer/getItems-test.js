const assert = require('assert')
const request = require('request-promise-native')
const nock = require('nock')

const step = require('../../../../../lib/magento/customer/getItems')

describe('magento/customer: getItems step', () => {
  let input = {}
  let context = {}
  const magentoUrl = 'http://localhost/shopgate/v2'
  const path = '/wishlists'

  beforeEach(() => {
    input = {
      token: 'testToken',
      wishlistId: '42'
    }

    context = {
      meta: {
        userId: 'shopgate@test.com'
      },
      config: {
        magentoUrl,
        allowSelfSignedCertificate: true
      },
      tracedRequest: () => {
        return request
      },
      log: {
        debug: (object, message) => {
        }
      },
      storage: {
        user: {
          map: {
            setItem: () => {
            },
            del: () => {
            }
          }
        }
      }
    }
  })

  it('Returns the correct product ids', async () => {
    nock(magentoUrl).get(`${path}/42/items`).reply(200, [{ product_id: '20' }, { product_id: '10' }])
    const response = await step(context, input)
    assert.deepStrictEqual(response, { productIds: ['20', '10'] })
  })

  it('Returns the correct product ids of simple products based on a config', async () => {
    nock(magentoUrl).get(`${path}/42/items`).reply(200, [{ product_id: '20' }, { product_id: '10', child_id: '30' }])
    const response = await step(context, input)
    assert.deepStrictEqual(response, { productIds: ['20', '10-30'] })
  })

  it('Returns the correct product ids of simple products based on a config with a empty child_id', async () => {
    nock(magentoUrl).get(`${path}/42/items`).reply(200, [{ product_id: '20' }, { product_id: '10', child_id: '' }])
    const response = await step(context, input)
    assert.deepStrictEqual(response, { productIds: ['20', '10'] })
  })

  it('Returns the correct product ids of simple products based on a config with child_id null', async () => {
    nock(magentoUrl).get(`${path}/42/items`).reply(200, [{ product_id: '20' }, { product_id: '10', child_id: null }])
    const response = await step(context, input)
    assert.deepStrictEqual(response, { productIds: ['20', '10'] })
  })
})
