const assert = require('assert')
const request = require('request-promise-native')
const sinon = require('sinon')

const step = require('../../../../../lib/magento/customer/deleteItems')
const MageRequest = require('../../../../../lib/magento/Request')

describe('magento/customer: deleteItems step', () => {
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
        debug: (object, message) => {}
      },
      storage: {
        user: {
          get: () => {},
          set: () => {}
        }
      }
    }
  })

  it('Should call the correct endpoint with correct storage values', async () => {
    input = {
      ...input,
      wishlistId: '2',
      productIds: ['123', '321']
    }
    const fake = sinon.fake.returns({ '123': '345', '321': '456' })
    sinon.replace(context.storage.user, 'get', fake)

    const stub = sinon.stub(MageRequest.prototype, 'send').callsFake((var1, var2, var3) => {})
    await step(context, input)
    assert(stub.calledWith(`${magentoUrl}/wishlists/2/items?wishlistItemIds=345,456`, 'deleteFavorites', 'DELETE'))
    stub.restore()
  })
})
