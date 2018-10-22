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
  /** @type {MagentoResponseWhishlists} wishlists */
  const wishlists = await request.send(wishlistIdsEndpointUrl, 'Request to Magento: getWishlists')
  const wishlistId = wishlists[0].wishlist_id

  return { wishlistId }
}
