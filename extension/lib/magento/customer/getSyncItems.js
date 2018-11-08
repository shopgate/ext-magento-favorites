const _ = {
  isEqual: require('lodash/isEqual'),
  differenceWith: require('lodash/differenceWith'),
  concat: require('lodash/concat')
}

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {Object[]} input.mageProductsIds
 * @param {Object[]} input.localProductsIds
 * @returns {Promise<{addProducts: Object[], productIds: Object[]}>}
 */
module.exports = async (context, input) => {
  const { mageProductsIds, localProductsIds } = input

  return {
    addProductsIds: _.differenceWith(localProductsIds, mageProductsIds, _.isEqual),
    productIds: _.concat(mageProductsIds, localProductsIds)
  }
}
