import productData from '../../../app/api/product.json'

export default defineEventHandler(() => productData.products)
