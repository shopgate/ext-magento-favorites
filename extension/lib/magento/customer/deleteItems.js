const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {string[]} input.productIds - array of ids of the products to remove
 * @param {string} input.token - user token for authentication
 * @param {string} input.wishlistId - id of the wishlist to modify
 */
module.exports = async (context, input) => {
  const wishlistItemIdMapping = await context.storage.user.map.get('wishlistItemIdMapping') || {}
  const wishlistItemIdsString = input.productIds.map(productId => wishlistItemIdMapping[productId]).toString()

  if (wishlistItemIdsString) {
    const request = new MagentoRequest(context, input.token)
    const itemFilter = `?wishlistItemIds=${wishlistItemIdsString}`
    const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${input.wishlistId}/items${itemFilter}`
    request.send(wishlistItemsEndpointUrl, 'deleteFavorites', 'DELETE')
  }
}
