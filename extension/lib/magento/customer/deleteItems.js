const MagentoRequest = require('../Request')

/**
 * @param {Object} context
 * @param {Object} input
 */
module.exports = async (context, input) => {
  const wishlistItemIdMapping = await context.storage.user.get('wishlistItemIdMapping')
  const wishlistItemIds = input.productIds.map(productId => wishlistItemIdMapping[productId])
  const wishlistItemIdsString = wishlistItemIds.toString()

  if (!wishlistItemIdsString) {
    return
  }

  const request = new MagentoRequest(context, input.token)
  const wishlistIdsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  /**
   * Get all wishlist ids of the customer. At the moment we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await request.send(wishlistIdsEndpointUrl, 'getWishlistItems')

  if (!wishlists.length || !wishlists[0].wishlist_id) {
    return
  }

  const itemFilter = `?wishlistItemIds=${wishlistItemIdsString}`
  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${wishlists[0].wishlist_id}/items${itemFilter}`
  request.send(wishlistItemsEndpointUrl, 'Request to Magento: deleteFavorites', 'DELETE')
}
