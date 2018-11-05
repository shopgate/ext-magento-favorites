const _ = {
  isEqual: require('lodash/isEqual'),
  differenceWith: require('lodash/differenceWith')
}

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {Object[]} input.favoriteList - products to put
 * @param {Object[]} input.magentoProducts - products currently on the magento fav list
 * @returns {Promise<{productIds: Object}>}
 */
module.exports = async (context, input) => {
  const { favoriteList, magentoProducts } = input
  let favIds = []
  let existIds = []

  for (let item of favoriteList) {
    favIds.push(item.id)
  }

  for (let item of magentoProducts) {
    existIds.push(item.id)
  }

  const removeProductIds = _.differenceWith(existIds, favIds, _.isEqual)
  const newProductIds = _.differenceWith(favIds, existIds, _.isEqual)
  let addProducts = []

  for (let id of newProductIds) {
    addProducts.push(favoriteList.find(product => product.id === id))
  }

  return {
    addProducts,
    removeProductIds
  }
}
