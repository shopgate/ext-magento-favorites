const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {string} input.token - user token for authentication
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  const request = new MagentoRequest(context, input.token)
  /**
   * Get all wishlist ids of the customer. At the moment we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await request.send(`${context.config.magentoUrl}/wishlists`, 'getWishlistItems')

  if (!wishlists.length || !wishlists[0].wishlist_id) {
    return { productIds: [] }
  }

  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${wishlists[0].wishlist_id}/items`
  const wishlistItems = await request.send(wishlistItemsEndpointUrl, 'Request to Magento: getFavorites', 'GET')
  context.storage.user.map.del('wishlistItemIdMapping')
  const productIds = wishlistItems.map(item => {
    context.storage.user.map.setItem('wishlistItemIdMapping', item.product_id, item.wishlist_item_id)
    return item.product_id
  })

  return { productIds }
}
