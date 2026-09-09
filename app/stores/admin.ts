import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Product } from '../type/product'

const API_BASE = 'http://localhost:8000'

type User = {
  id: number | string
  firstName: string
  lastName: string
  name: string
  email: string
  password: string
  role?: string
}

type OrderItem = {
  productId: number | string
  quantity: number
}

type Order = {
  id: number | string
  userId: number | string
  products: OrderItem[]
  total: number
  status: string
}

type LoginRecord = {
  id: number | string
  userId: number | string
  name: string
  email: string
  method: 'login' | 'register'
  time: string
  userAgent?: string
}

export type ProductForm = Omit<Product, 'id' | 'finalPrice'>

export const useAdminStore = defineStore('admin', () => {
  const products = ref<Product[]>([])
  const users = ref<User[]>([])
  const orders = ref<Order[]>([])
  const loginLog = ref<LoginRecord[]>([])
  const isLoading = ref(false)
  const error = ref('')

  const totalRevenue = computed(() =>
    orders.value.reduce((sum, o) => sum + Number(o.total), 0)
  )

  const totalUsers = computed(() => users.value.length)
  const totalOrders = computed(() => orders.value.length)
  const totalProducts = computed(() => products.value.length)
  const totalLogins = computed(() => loginLog.value.length)
  const lowStockCount = computed(
    () => products.value.filter((p) => Number(p.stock) <= 5).length
  )

  async function fetchProducts() {
    isLoading.value = true
    error.value = ''
    try {
      const res = await fetch(`${API_BASE}/products`)
      if (!res.ok) throw new Error('Unable to load products.')
      products.value = await res.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load products.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUsers() {
    isLoading.value = true
    error.value = ''
    try {
      const res = await fetch(`${API_BASE}/users`)
      if (!res.ok) throw new Error('Unable to load users.')
      users.value = await res.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load users.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrders() {
    isLoading.value = true
    error.value = ''
    try {
      const res = await fetch(`${API_BASE}/orders`)
      if (!res.ok) throw new Error('Unable to load orders.')
      orders.value = await res.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load orders.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLoginLog() {
    isLoading.value = true
    error.value = ''
    try {
      const res = await fetch(`${API_BASE}/loginLog`)
      if (!res.ok) throw new Error('Unable to load login history.')
      const data = await res.json()
      loginLog.value = Array.isArray(data) ? data : []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load login history.'
    } finally {
      isLoading.value = false
    }
  }

  async function loadDashboard() {
    await Promise.all([fetchProducts(), fetchUsers(), fetchOrders(), fetchLoginLog()])
  }

  function lastLoginTime(userId: User['id']): string {
    const record = loginLog.value
      .filter((r) => String(r.userId) === String(userId) && r.method === 'login')
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0]
    return record ? record.time : ''
  }

  async function createProduct(form: ProductForm): Promise<Product> {
    const body = buildProductPayload(form)
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Unable to create product.')
    const created = await res.json()
    await fetchProducts()
    return created
  }

  async function updateProduct(id: Product['id'], form: ProductForm): Promise<Product> {
    const body = buildProductPayload(form)
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Unable to update product.')
    const updated = await res.json()
    await fetchProducts()
    return updated
  }

  async function deleteProduct(id: Product['id']): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Unable to delete product.')
    products.value = products.value.filter((p) => p.id !== id)
  }

  function buildProductPayload(form: ProductForm): Product {
    const price = Number(form.price) || 0
    const discount = Number(form.discount) || 0
    const finalPrice = price - price * (discount / 100)
    return {
      id: '',
      name: form.name,
      category: form.category,
      price,
      discount,
      finalPrice: Math.round(finalPrice * 100) / 100,
      tag: form.tag,
      image: form.image,
      description: form.description,
      brand: form.brand,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
    }
  }

  function getUserName(userId: Order['userId']): string {
    const u = users.value.find((x) => String(x.id) === String(userId))
    return u ? u.name : `User #${userId}`
  }

  return {
    products,
    users,
    orders,
    loginLog,
    isLoading,
    error,
    totalRevenue,
    totalUsers,
    totalOrders,
    totalProducts,
    totalLogins,
    lowStockCount,
    fetchProducts,
    fetchUsers,
    fetchOrders,
    fetchLoginLog,
    loadDashboard,
    createProduct,
    updateProduct,
    deleteProduct,
    getUserName,
    lastLoginTime,
  }
})
