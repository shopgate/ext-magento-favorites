const MagentoRequest = require('../Request')
const _ = {
  forEach: require('lodash/forEach')
}

/**
 * @param {Object} context
 * @param {Object} input
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  if (!context.meta.userId) {
    return { productIds: [] }
  }

  return getItems(context, input.token)
}

async function getItems (context, token) {
  const wishlistIdsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  const productIds = []
  /**
   * Get all wishlist ids of the customer. At the moment we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await MagentoRequest.send(wishlistIdsEndpointUrl, context, token, 'GET')

  if (!wishlists.length || !wishlists[0].wishlist_id) {
    return { productIds }
  }

  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${wishlists[0].wishlist_id}/items`
  const wishlistItems = await MagentoRequest.send(wishlistItemsEndpointUrl, context, token, 'GET', 'Request to Magento: getFavorites')

  _.forEach(wishlistItems, (wishlistItem) => {
    productIds.push(wishlistItem.product_id)
  })

  return { productIds }
}
