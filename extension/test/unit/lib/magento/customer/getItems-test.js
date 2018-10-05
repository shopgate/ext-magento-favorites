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
      token: 'testToken'
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
      }
    }
  })

  it('Test that if wishlist is empty, no product ids are returned', async () => {
    nock(magentoUrl).get(path).reply(200, { empty: true })
    const response = await step(context, input)
    assert.deepStrictEqual(response, { productIds: [] })
  })

  it('Returns the correct product ids', async () => {
    nock(magentoUrl).get(path).reply(200, [{ wishlist_id: 2 }, { wishlist_id: 1 }])
    nock(magentoUrl).get(`${path}/2/items`).reply(200, [{ product_id: '20' }, { product_id: '10' }])
    const response = await step(context, input)
    assert.deepStrictEqual(response, { productIds: ['20', '10'] })
  })
})
