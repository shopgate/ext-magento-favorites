const { differenceWith, isEqual } = require('lodash')
/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {array} input.productIds - products to put
 * @param {array} input.magentoProductIds - products currently on the magento fav list
 * @returns {Promise<{productIds: Object}>}
 */
module.exports = async (context, input) => {
  const { productIds: putProductIds, magentoProductIds: existProductIds } = input
  const addProductIds = differenceWith(putProductIds, existProductIds, isEqual)
  const removeProductIds = differenceWith(existProductIds, putProductIds, isEqual)

  console.log(
    'ADD ITEMS', addProductIds,
    'REMOVE ITEMS', removeProductIds
  )

  return {
    addProductIds,
    removeProductIds
  }
}
