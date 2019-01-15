const assert = require('assert')
const step = require('../../../../../lib/magento/customer/getDiff')

describe('getDiff', () => {
  let context
  let input

  beforeEach(() => {
    context = {}
    input = {}
  })

  it('Should return correct arrays for adding and deleting products', async () => {
    input = {
      favoriteList: [{ id: 10 }, { id: 20 }],
      magentoProducts: [{ id: 20 }, { id: 30 }]
    }

    const expectedAddResult = [{ id: 10 }]
    const expectedDeleteResult = [30]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProducts, expectedAddResult)
    assert.deepStrictEqual(diffObject.removeProductIds, expectedDeleteResult)
  })

  it('Should return correct arrays for adding products (no delete)', async () => {
    input = {
      favoriteList: [{ id: 10 }, { id: 20 }, { id: 40 }],
      magentoProducts: [{ id: 10 }, { id: 20 }]
    }

    const expectedAddResult = [{ id: 40 }]
    const expectedDeleteResult = []
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProducts, expectedAddResult)
    assert.deepStrictEqual(diffObject.removeProductIds, expectedDeleteResult)
  })

  it('Should return correct arrays for delete products (no adding)', async () => {
    input = {
      favoriteList: [{ id: 10 }],
      magentoProducts: [{ id: 10 }, { id: 20 }, { id: 30 }]
    }

    const expectedAddResult = []
    const expectedDeleteResult = [20, 30]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProducts, expectedAddResult)
    assert.deepStrictEqual(diffObject.removeProductIds, expectedDeleteResult)
  })
})
