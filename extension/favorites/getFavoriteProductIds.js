const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

/**
 * @param context
 * @param token
 */
function getFavoriteProductsIdsFromStorage (context, token) {
  return ['12']
}

/**
 * @param {string} endpointUrl
 * @param {Object} context
 * @param {string} token
 */
async function getFavoriteProductsIdsFromMagento (endpointUrl, context, token) {
  await MagentoRequest.send(endpointUrl, context, token, 'Request to Magento: getFavorites')
}

/**
 * @param {Object} context
 * @param {Object} input
 * @returns {Promise<{productIds: number[]}>}
 */
module.exports = async (context, input) => {
  let productIds = []
  const endpointUrl = `${context.config.magentoUrl}/wishlists`

  // Guests will receive their favs from the app storage, logged in users directly from the mage endpoint
  if (!context.meta.userId) {
    productIds = getFavoriteProductsIdsFromStorage(context, input.token)
  } else {
    productIds = await getFavoriteProductsIdsFromMagento(endpointUrl, context, input.token)
  }

  return { productIds }
}
