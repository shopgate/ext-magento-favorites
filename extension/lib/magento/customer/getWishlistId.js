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

  /**
   * Possible edge case if a customer's default wishlist gets removed from Magento (via direct DB query).
   * We will constantly reference an erroneous old ID until we clear the app's cache.
   */
  let wishlistId = await context.storage.user.get('defaultWishlistId')
  if (!wishlistId) {
    wishlistId = await getWishlistId(context, input.token)
    await context.storage.user.set('defaultWishlistId', wishlistId)

    return { wishlistId }
  }
  context.log.debug(`Retrieved default wishlist id: ${wishlistId} from storage`)

  return { wishlistId }
}

/**
 * Retrieves the default wishlist from Magento,
 * if it does not exists, creates it.
 *
 * @param {StepContext} context
 * @param {string} token
 * @return {Promise<string>}
 */
async function getWishlistId (context, token) {
  const request = new MagentoRequest(context, token)
  const wishlistsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  /** @type {MagentoResponseWishlistItem[]} wishlists */
  const wishlists = await request.send(wishlistsEndpointUrl, 'getWishlists')
  if (wishlists.length === 0) {
    const wishlist = await request.send(wishlistsEndpointUrl, 'createWishlist', 'POST', { name: 'Default List' })

    return wishlist.wishlistId
  }

  return wishlists[0].wishlist_id
}
