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
  // const addProductIds = differenceWith(putProductIds, existProductIds, isEqual)
  // const removeProductIds = differenceWith(existProductIds, putProductIds, isEqual)
  console.log('######################### ALLE  ########################')
  let favIds = []
  let existIds = []
  favoriteList.map(item => {
    favIds.push(item.id)
  })
  console.log('###################### MAGENTO ########################')
  magentoProducts.map(item => {
    existIds.push(item.id)
  })

  const removeProductIds = differenceWith(existIds, favIds, isEqual)
  // console.log('removeProductIds', removeProductIds)
  const newProductIds = differenceWith(favIds, existIds, isEqual)
  console.log('newProductIds', newProductIds)

  let addProducts = []
  favoriteList.map(product => {
    newProductIds.map(id => {
      console.log(id, '-', product.id)
      if (id === product.id) {
        addProducts.push(product)
      }
    })
  })

  const useAddPipeline = newProductIds.length > 0

  /*
  console.log('putProductIds', putProductIds)
  console.log('existProductIds', existProductIds)

  console.log(
    'ADD ITEMS', addProductIds,
    'REMOVE ITEMS', removeProductIds
  )
  */
  console.log('############ ADD ###########')
  // console.log(addProductIds)
  return {
    addProducts,
    removeProductIds,
    useAddPipeline
  }
}
