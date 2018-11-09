const assert = require('assert')
const step = require('../../../../../lib/magento/customer/getSyncItems')

describe('getSyncItems', () => {
  let context
  let input

  beforeEach(() => {
    context = {}
    input = {}
  })

  it('Should return the full list of products ids and correct array of product id(s) to add by adding one guest product', async () => {
    input = {
      mageProductsIds: [{ id: 10 }],
      guestProductIds: [{ id: 20 }]
    }

    const expectedAddResult = [{ id: 20 }]
    const expectedProductIdsResult = [{ id: 10 }, { id: 20 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of products ids and a empty array of products id(s) to add because the product products are the same', async () => {
    input = {
      mageProductsIds: [{ id: 20 }],
      guestProductIds: [{ id: 20 }]
    }

    const expectedAddResult = []
    const expectedProductIdsResult = [{ id: 20 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return  the full list of products ids and a empty array of products id(s) to add because there are no guest product given', async () => {
    input = {
      mageProductsIds: [{ id: 20 }, { id: 30 }],
      guestProductIds: []
    }

    const expectedAddResult = []
    const expectedProductIdsResult = [{ id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of products ids and a correct array of products id(s) to add by empty mage products', async () => {
    input = {
      mageProductsIds: [],
      guestProductIds: [{ id: 20 }, { id: 30 }]
    }

    const expectedAddResult = [{ id: 20 }, { id: 30 }]
    const expectedProductIdsResult = [{ id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of products ids and correct array of products id(s) to add on merge', async () => {
    input = {
      mageProductsIds: [{ id: 40 }],
      guestProductIds: [{ id: 20 }, { id: 30 }]
    }

    const expectedAddResult = [{ id: 20 }, { id: 30 }]
    const expectedProductIdsResult = [{ id: 40 }, { id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return the full list of products ids and array of all guest products id(s) because there are no mage products', async () => {
    input = {
      mageProductsIds: [],
      guestProductIds: [{ id: 20 }, { id: 30 }]
    }

    const expectedAddResult = [{ id: 20 }, { id: 30 }]
    const expectedProductIdsResult = [{ id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })

  it('Should return  the full list of products ids and array of all product id(s) to add becsuse there are no guest products given', async () => {
    input = {
      mageProductsIds: [{ id: 20 }, { id: 30 }],
      guestProductIds: []
    }

    const expectedAddResult = []
    const expectedProductIdsResult = [{ id: 20 }, { id: 30 }]
    const diffObject = await step(context, input)

    assert.deepStrictEqual(diffObject.addProductsIds, expectedAddResult)
    assert.deepStrictEqual(diffObject.productIds, expectedProductIdsResult)
  })
})
