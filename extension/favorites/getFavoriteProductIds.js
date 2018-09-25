const MagentoRequest = require('../lib/MagentoRequest')
const UnkownError = require('../models/Errors/UnknownError')
const _ = {
  forEach: require('lodash/forEach')
}

/**
 * @param {Object} context
 * @returns {Promise<{string[]}>}
 */
async function getFavoriteProductsIdsFromStorage (context) {
  return new Promise((resolve, reject) => {
    context.storage.device.get('whislistProductIds', async (err, productIds) => {
      if (err) {
        console.log('ERRRRRRR')
        reject(new UnkownError(err))
      }

      if (!productIds) {
        productIds = []
      }

      resolve({ productIds })
    })
  })
}

/**
 * @param {Object} context
 * @param {string} token
 * @returns {Promise<{string[]}>}
 */
async function getFavoriteProductsIdsFromMagento (context, token) {
  const wishlistIdsEndpointUrl = `${context.config.magentoUrl}/wishlists`

  /**
   * Get all whishlist ids of the customer. Actually we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await MagentoRequest.send(wishlistIdsEndpointUrl, context, token, 'Request to Magento: getWishlists')

  // Actually we are only supporting one whishlist per customer.
  if (!wishlists[0] || !wishlists[0].wishlist_id) {
    return []
  }

  // Actually we are only supporting one whishlist per customer.
  const wishlistItemsEndpointUrl = `${context.config.magentoUrl}/wishlists/${wishlists[0].wishlist_id}/items`
  const wishlistItems = await MagentoRequest.send(wishlistItemsEndpointUrl, context, token, 'Request to Magento: getFavorites')
  const productIds = []
  _.forEach(wishlistItems, (wishlistItem) => {
    productIds.push(wishlistItem.product_id)
  })

  return { productIds }
}

/**
 * @param {Object} context
 * @param {Object} input
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  // Guests will receive their favs from the device storage, logged in users directly from the mage endpoint
  if (!context.meta.userId) {
    return getFavoriteProductsIdsFromStorage(context)
  }

  return getFavoriteProductsIdsFromMagento(context, input.token)
}
