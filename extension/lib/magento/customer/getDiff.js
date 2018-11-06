const _ = {
  isEqual: require('lodash/isEqual'),
  differenceWith: require('lodash/differenceWith')
}

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {Object[]} input.favoriteList - products to put
 * @param {Object[]} input.magentoProducts - products currently on the magento fav list
 * @returns {Promise<{addProducts: Object[], removeProductIds: string[]}>}
 */
module.exports = async (context, input) => {
  const { favoriteList, magentoProducts } = input

  const favIds = favoriteList.map(item => item.id)
  const existIds = magentoProducts.map(item => item.id)

  const removeProductIds = _.differenceWith(existIds, favIds, _.isEqual)
  const newProductIds = _.differenceWith(favIds, existIds, _.isEqual)

  const addProducts = newProductIds.map(id => {
    return favoriteList.find(product => product.id === id)
  })

  return {
    addProducts,
    removeProductIds
  }
}
