const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  const request = new MagentoRequest(context, input.token)

  const wishlistAddItemEndpointUrl = `${context.config.magentoUrl}/wishlists/${input.wishlistId}/items`
  const wishlistItems = input.transformedProducts.map(({ product }) => product)

  const response = await request.send(wishlistAddItemEndpointUrl, 'addFavorites', 'POST', wishlistItems)
  const wishlistItemIdMapping = await context.storage.user.get('wishlistItemIdMapping') || {}

  Object.entries(response.wishlistItemIds).forEach(entry => {
    wishlistItemIdMapping[entry[0]] = entry[1]
  })
  context.storage.user.set('wishlistItemIdMapping', wishlistItemIdMapping)
}
