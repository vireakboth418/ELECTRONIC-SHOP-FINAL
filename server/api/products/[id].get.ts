import productData from '../../../app/api/product.json'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const product = productData.products.find((item) => item.id === id)

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return product
})
