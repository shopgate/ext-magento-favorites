const MagentoRequest = require('../Request')

/**
 * Deletion of the mapping in storage happens in the getItems request
 *
 * @param {StepContext} context
 * @param {Object} input
 * @param {string[]} input.productIds - array of ids of the products to remove
 * @param {string} input.token - user token for authentication
 * @param {string} input.wishlistId - id of the wishlist to modify
 */
module.exports = async (context, input) => {
  const wishlistItemIdMapping = await context.storage.user.map.get('wishlistItemIdMapping') || {}
  const wishlistItemIdsString = input.productIds.map(productId => wishlistItemIdMapping[productId]).toString()

  if (!wishlistItemIdsString) {
    context.log.debug('No products of this mapping exist in the storage.')

    return
  }

  const request = new MagentoRequest(context, input.token)
  const itemFilter = `?wishlistItemIds=${wishlistItemIdsString}`
  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${input.wishlistId}/items${itemFilter}`
  await request.send(wishlistItemsEndpointUrl, 'deleteFavorites', 'DELETE')
}
