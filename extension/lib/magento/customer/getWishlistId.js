const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @returns {Promise<{wishlistId: string}>}
 */
module.exports = async (context, input) => {
  if (input.wishlistId) {
    return input.wishlistId
  }
  const request = new MagentoRequest(context, input.token)
  const wishlistIdsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  /**
   * Get all wishlist ids of the customer. At the moment we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await request.send(wishlistIdsEndpointUrl, 'Request to Magento: getWishlists')
  const wishlistId = wishlists[0].wishlist_id

  return { wishlistId }
}
