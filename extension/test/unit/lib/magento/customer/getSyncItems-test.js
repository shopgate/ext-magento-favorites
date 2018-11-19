const assert = require('assert')
const step = require('../../../../../lib/magento/customer/getSyncItems')

describe('getSyncItems', () => {
  let context
  let input

  beforeEach(() => {
    context = {}
    input = {}
  })

  it('Should return the full list of product ids and correct array of product id(s) to add by adding one guest product', async () => {
    input = {
      mageProductsIds: [10],
      guestProductIds: [20]
    }

    const expectedAddResult = [20]
    const expectedProductIdsResult = [10, 20]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of product ids and a empty array of product id(s) to add because the product products are the same', async () => {
    input = {
      mageProductsIds: [20],
      guestProductIds: [20]
    }

    const expectedAddResult = []
    const expectedProductIdsResult = [20]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of product ids and a empty array of product id(s) to add because there are no guest product given', async () => {
    input = {
      mageProductsIds: [20, 30],
      guestProductIds: []
    }

    const expectedAddResult = []
    const expectedProductIdsResult = [20, 30]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of product ids and a correct array of product id(s) to add by empty mage products', async () => {
    input = {
      mageProductsIds: [],
      guestProductIds: [20, 30]
    }

    const expectedAddResult = [20, 30]
    const expectedProductIdsResult = [20, 30]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of product ids and correct array of product id(s) to add on merge', async () => {
    input = {
      mageProductsIds: [40],
      guestProductIds: [20, 30]
    }

    const expectedAddResult = [20, 30]
    const expectedProductIdsResult = [40, 20, 30]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of product ids and array of all guest product id(s) because there are no mage products', async () => {
    input = {
      mageProductsIds: [],
      guestProductIds: [20, 30]
    }

    const expectedAddResult = [20, 30]
    const expectedProductIdsResult = [20, 30]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of product ids and array of all product id(s) to add becsuse there are no guest products given', async () => {
    input = {
      mageProductsIds: [20, 30],
      guestProductIds: []
    }

    const expectedAddResult = []
    const expectedProductIdsResult = [20, 30]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })
})
