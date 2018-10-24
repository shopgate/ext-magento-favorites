const assert = require('assert')
const request = require('request-promise-native')
const nock = require('nock')

const step = require('../../../../../lib/magento/customer/getWishlistId')

describe('magento/customer: getWishlistId step', () => {
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

  it('Creates a new Wishlist, if none exists', async () => {
    nock(magentoUrl).get(path).reply(200, [])
    nock(magentoUrl).post(path).reply(200, { wishlistId: 5 })
    const response = await step(context, input)
    assert.deepStrictEqual(response, { wishlistId: 5 })
  })

  it('Returns the correct Wishlist id', async () => {
    nock(magentoUrl).get(path).reply(200, [{ wishlist_id: 42 }, { wishlist_id: 23 }])
    const response = await step(context, input)
    assert.deepStrictEqual(response, { wishlistId: 42 })
  })
})
