const MagentoRequest = require('../Request')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {string} input.token - user token for authentication
 * @param {string} input.wishlistId - id of the wishlist to modify
 * @param {array} input.transformedProducts - user token for authentication
 */
module.exports = async (context, input) => {
  const wishlistItems = input.transformedProducts.map(({ product }) => product)

  if (wishlistItems.length > 0) {
    const request = new MagentoRequest(context, input.token)
    const wishlistAddItemEndpointUrl = `${context.config.magentoUrl}/wishlists/${input.wishlistId}/items`
    const response = await request.send(wishlistAddItemEndpointUrl, 'addFavorites', 'POST', wishlistItems)

    Object.entries(response.wishlistItemIds).forEach(entry => {
      context.storage.user.map.setItem('wishlistItemIdMapping', entry[0], entry[1])
    })
  }
}
