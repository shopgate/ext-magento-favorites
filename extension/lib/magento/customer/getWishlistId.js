const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @returns {Promise<{wishlistId: string}>}
 */
module.exports = async (context, input) => {
  if (input.wishlistId) {
    return { wishlistId: input.wishlistId }
  }

  const request = new MagentoRequest(context, input.token)
  const wishlistsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  /** @type {MagentoResponseWishlistItem[]} wishlists */
  const wishlists = await request.send(wishlistsEndpointUrl, 'getWishlists')
  if (wishlists.length === 0) {
    return request.send(wishlistsEndpointUrl, 'createWishlist', 'POST', { name: 'Default List' })
  }

  return { wishlistId: wishlists[0].wishlist_id }
}
