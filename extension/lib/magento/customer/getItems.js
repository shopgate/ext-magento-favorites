const MagentoRequest = require('../Request')

/**
 * @param {Object} context
 * @param {Object} input
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  const request = new MagentoRequest(context, input.token)
  const wishlistIdsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  /**
   * Get all wishlist ids of the customer. At the moment we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await request.send(wishlistIdsEndpointUrl, 'getWishlistItems')

  if (!wishlists.length || !wishlists[0].wishlist_id) {
    return { productIds: [] }
  }

  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${wishlists[0].wishlist_id}/items`
  const wishlistItems = await request.send(wishlistItemsEndpointUrl, 'Request to Magento: getFavorites', 'GET')
  const productIds = wishlistItems.map(item => item.product_id)

  return { productIds }
}
