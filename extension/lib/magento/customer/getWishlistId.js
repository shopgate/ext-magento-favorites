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
  const wishlistsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  /** @type {MagentoResponseWishlists} wishlists */
  const wishlists = await request.send(wishlistsEndpointUrl, 'Request to Magento: getWishlists')
  if (wishlists.length === 0) {
    const params = { visibility: 'private' }
    const result = await request.send(wishlistsEndpointUrl, 'Request to Magento: createWishlists', 'POST', params)
    return { wishlistId: result.wishlistId }
  }
  const wishlistId = wishlists[0].wishlist_id
  return { wishlistId }
}
