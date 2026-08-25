import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Product } from '../type/product'

type CartItem = Product & { quantity: number }

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  function addProduct(product: Product) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) existing.quantity += 1
    else items.value.push({ ...product, quantity: 1 })
  }
  function updateQuantity(productId: Product['id'], quantity: number) {
    const item = items.value.find((cartItem) => cartItem.id === productId)
    if (!item) return
    if (quantity <= 0) items.value = items.value.filter((cartItem) => cartItem.id !== productId)
    else item.quantity = quantity
  }

  function clearCart() {
    items.value = []
  }

  return { items, itemCount, addProduct, updateQuantity, clearCart }
})
