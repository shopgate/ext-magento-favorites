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
      productIds: [1, 2],
      magentoProductIds: [2, 3]
    }

    const expectedAddResult = [1]
    const expectedDeleteResult = [3]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.removeProductIds, expectedDeleteResult)
  })
})
