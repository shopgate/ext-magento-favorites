const _ = {
  isEqual: require('lodash/isEqual'),
  differenceWith: require('lodash/differenceWith'),
  concat: require('lodash/concat'),
  uniq: require('lodash/uniq')
}

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {string[]} input.mageProductsIds
 * @param {string[]} input.localProductsIds
 * @returns {Promise<{addProducts: string[], productIds: string[]}>}
 */
module.exports = async (context, input) => {
  const { mageProductsIds, guestProductIds } = input

  return {
    addProductsIds: _.differenceWith(guestProductIds, mageProductsIds, _.isEqual),
    productIds: _.uniq(_.concat(mageProductsIds, guestProductIds))
  }
}
