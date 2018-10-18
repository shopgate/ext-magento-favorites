const MagentoRequest = require('../Request')

/**
 * @param {Object} context
 * @param {Object} input
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  const request = new MagentoRequest(context, input.token)

  const wishlistAddItemEndpointUrl = `${context.config.magentoUrl}/wishlists/${input.wishlistId}/items`
  const wishlistItems = input.transformedProducts.map(({ product }) => product)

  await request.send(wishlistAddItemEndpointUrl, 'Request to Magento: addFavorites', 'POST', wishlistItems)
}
