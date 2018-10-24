const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {string} input.token - user token for authentication
 * @param {string} input.wishlistId - id of the wishlist to modify
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  const request = new MagentoRequest(context, input.token)
  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${input.wishlistId}/items`
  const wishlistItems = await request.send(wishlistItemsEndpointUrl, 'Request to Magento: getFavorites', 'GET')
  context.storage.user.map.del('wishlistItemIdMapping')
  const productIds = wishlistItems.map(item => {
    context.storage.user.map.setItem('wishlistItemIdMapping', item.product_id, item.wishlist_item_id)
    return item.product_id
  })

  return { productIds }
}
