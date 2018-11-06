const assert = require('assert')
const request = require('request-promise-native')
const nock = require('nock')
const sinon = require('sinon')

const addItems = require('../../../../../lib/magento/customer/addItems')
const transformItemId = require('../../../../../lib/transformItemId')
const MageRequest = require('../../../../../lib/magento/Request')

describe('magento/customer: addItems step', () => {
  let input = {}
  let context = {}
  const magentoUrl = 'http://localhost/shopgate/v2'

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
            }
          }
        }
      }
    }
  })
  it('Should return a "productId" key based on the "id" key', async () => {
    input.products = [{ id: '337' }]

    const result = await transformItemId(context, input)
    const resultItem = result.products.pop()
    assert.deepStrictEqual(resultItem, { id: '337', productId: '337' })
  })
  it('Should use the user storage', async () => {
    const input = {
      token: 'testToken',
      wishlistId: '1',
      transformedProducts: ['1']
    }
    nock(magentoUrl).post('/wishlists/1/items').reply(200, { wishlistItemIds: ['1', '2'] })
    const requestSpy = sinon.spy(context.storage.user.map, 'setItem')
    await addItems(context, input)
    assert(requestSpy.called)
  })
  it('Should not call send if there are no wishlist items', async () => {
    const input = {
      token: 'testToken',
      wishlistId: '1',
      transformedProducts: []
    }

    const requestSpy = sinon.spy(MageRequest.prototype, 'send')
    await addItems(context, input)
    sinon.assert.notCalled(requestSpy)
    requestSpy.restore()
  })
})
