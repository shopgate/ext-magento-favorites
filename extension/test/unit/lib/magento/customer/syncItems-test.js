const assert = require('assert')
const step = require('../../../../../lib/magento/customer/getSyncItems')

describe('getSyncItems', () => {
  let context
  let input

  beforeEach(() => {
    context = {}
    input = {}
  })

  it('Should return correct arrays for adding one product', async () => {
    input = {
      mageProductsIds: [{ id: 10 }],
      guestProductIds: [{ id: 20 }]
    }

    const expectedAddResult = [{ id: 20 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
  })

  it('Should return a empty array - same products', async () => {
    input = {
      mageProductsIds: [{ id: 20 }],
      guestProductIds: [{ id: 20 }]
    }

    const expectedAddResult = []
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
  })

  it('Should return a empty array - no local products', async () => {
    input = {
      mageProductsIds: [{ id: 20 }, { id: 30 }],
      guestProductIds: []
    }

    const expectedAddResult = []
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
  })

  it('Should return correct arrays for empty mage products', async () => {
    input = {
      mageProductsIds: [],
      guestProductIds: [{ id: 20 }, { id: 30 }]
    }

    const expectedAddResult = [{ id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
  })

  it('Should return correct arrays current products ids - merge', async () => {
    input = {
      mageProductsIds: [{ id: 40 }],
      guestProductIds: [{ id: 20 }, { id: 30 }]
    }

    const expectedAddResult = [{ id: 40 }, { id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.productIds, expectedAddResult)
  })

  it('Should return correct arrays current products ids - no mage products', async () => {
    input = {
      mageProductsIds: [],
      localProductsIds: [{ id: 20 }, { id: 30 }]
    }

    const expectedAddResult = [{ id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.productIds, expectedAddResult)
  })

  it('Should return correct arrays current products ids - no local products', async () => {
    input = {
      mageProductsIds: [{ id: 20 }, { id: 30 }],
      localProductsIds: []
    }

    const expectedAddResult = [{ id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.productIds, expectedAddResult)
  })
})
