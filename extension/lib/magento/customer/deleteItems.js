const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {string[]} input.productIds - array of ids of the products to remove
 * @param {string} input.token - user token for authentication
 */
module.exports = async (context, input) => {
  const wishlistItemIdMapping = await context.storage.user.get('wishlistItemIdMapping')
  const wishlistItemIdsString = input.productIds.map(productId => wishlistItemIdMapping[productId]).toString()

  if (!wishlistItemIdsString) {
    return
  }

  const request = new MagentoRequest(context, input.token)
  /**
   * Get all wishlist ids of the customer. At the moment we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await request.send(`${context.config.magentoUrl}/wishlists`, 'getWishlistItems')

  if (!wishlists.length || !wishlists[0].wishlist_id) {
    return
  }

  const itemFilter = `?wishlistItemIds=${wishlistItemIdsString}`
  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${wishlists[0].wishlist_id}/items${itemFilter}`
  request.send(wishlistItemsEndpointUrl, 'Request to Magento: deleteFavorites', 'DELETE')
}
