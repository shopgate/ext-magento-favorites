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
      favoriteList: [{ id: 1 }, { id: 2 }],
      magentoProducts: [{ id: 2 }, { id: 3 }]
    }

    const expectedAddResult = [{ id: 1 }]
    const expectedDeleteResult = [3]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProducts, expectedAddResult)
    assert.deepStrictEqual(diffObject.removeProductIds, expectedDeleteResult)
  })
})
