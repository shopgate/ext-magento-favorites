const MagentoRequest = require('../Request')

/**
 * @param {Object} context
 * @param {Object} input
 * @returns {Promise<{productIds: string[]}>}
 */
module.exports = async (context, input) => {
  const request = new MagentoRequest(context, input.token)
  const wishlistIdsEndpointUrl = `${context.config.magentoUrl}/wishlists`
  /**
   * Get all wishlist ids of the customer. At the moment we only support one wishlist per customer
   * @typedef {Object} wishlists
   * @property {string} wishlist_id
   */
  const wishlists = await request.send(wishlistIdsEndpointUrl, 'getWishlists')
  const wishlistId = wishlists[0].wishlist_id
  const wishlistAddItemEndpointUrl = `${context.config.magentoUrl}/wishlists/${wishlistId}/items`
  let wishlistItems = []
  input.products.map(item => {
    let itemProperties = {}
    if (item.metadata) {
      const { metadata: { type, selectedAttributes } } = item
      switch (type) {
        case 'configurable': {
          itemProperties.product_id = item.id.split('-')[0]
          itemProperties.super_attribute = getSuperAttributes(selectedAttributes)
          wishlistItems.push(itemProperties)
          break
        }
        default:
          break
      }
    } else {
      itemProperties.product_id = item.id
      wishlistItems.push(itemProperties)
    }
  })

  await request.send(wishlistAddItemEndpointUrl, 'Request to Magento: addFavorites', 'POST', wishlistItems)

  function getSuperAttributes (selectedAttributes) {
    let result = {}
    selectedAttributes.map(attribute => {
      result[attribute.attributeId] = attribute.optionId
    })
    return result
  }
}
