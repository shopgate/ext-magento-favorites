const { differenceWith, isEqual } = require('lodash')
/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {string} input.token - user token for authentication
 * @param {string} input.wishlistId - id of the wishlist to modify
 * @param {array} input.transformedProducts - user token for authentication
 * @returns {Promise<{productIds: string[]}>}
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
