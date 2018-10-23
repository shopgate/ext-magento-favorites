const assert = require('assert')
const request = require('request-promise-native')
const nock = require('nock')
const sinon = require('sinon')

const getWishlistId = require('../../../../../lib/magento/customer/getWishlistId')
const addItems = require('../../../../../lib/magento/customer/addItems')
const transformItemId = require('../../../../../lib/transformItemId')

describe('magento/customer: addItems step', () => {
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
      },
      storage: {
        user: {
          get: () => {
          },
          set: () => {
          }
        }
      }
    }
  })
  it('Should return the first existing wishlistId', async () => {
    nock(magentoUrl).get(path).reply(200, [{ wishlist_id: 2 }, { wishlist_id: 1 }])
    const response = await getWishlistId(context, input)
    assert.deepStrictEqual(response, { wishlistId: 2 })
  })
  it('Should return a "productId" key based on the "id" key', async () => {
    const input = {
      products:
        [{
          id: '337'
        }]
    }
    const result = await transformItemId(context, input)
    const resultItem = result.products.pop()
    assert.deepStrictEqual(resultItem, { id: '337', productId: '337' })
  })
  it('Should use the user storage', async () => {
    const input = {
      token: 'testToken',
      wishlistId: '1',
      transformedProducts: []
    }
    nock(magentoUrl).post('/wishlists/1/items').reply(200, { wishlistItemIds: ['1', '2'] })
    const requestSpy = sinon.spy(context.storage.user, 'get')
    await addItems(context, input)
    assert(requestSpy.called)
  })
})