/**
 * @param {Object} context
 * @param {Object} input
 * @returns {Promise<{products: Object}>}
 */
module.exports = async (context, input) => {
  const products = input.products
  products.map(product => {
    product.productId = product.id
  })
  return { products }
}
