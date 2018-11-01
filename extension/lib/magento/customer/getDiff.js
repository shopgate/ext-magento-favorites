const { differenceWith, isEqual } = require('lodash')
/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {array} input.productIds - products to put
 * @param {array} input.magentoProductIds - products currently on the magento fav list
 * @returns {Promise<{productIds: Object}>}
 */
module.exports = async (context, input) => {
  const { favoriteList, magentoProducts } = input
  let favIds = []
  let existIds = []

  favoriteList.map(item => {
    favIds.push(item.id)
  })
  magentoProducts.map(item => {
    existIds.push(item.id)
  })

  const removeProductIds = differenceWith(existIds, favIds, isEqual)
  const newProductIds = differenceWith(favIds, existIds, isEqual)
  let addProducts = []

  favoriteList.map(product => {
    newProductIds.map(id => {
      if (id === product.id) {
        addProducts.push(product)
      }
    })
  })

  return {
    addProducts,
    removeProductIds
  }
}
