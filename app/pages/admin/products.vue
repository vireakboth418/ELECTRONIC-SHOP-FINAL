<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useAdminStore, type ProductForm } from '~/stores/admin'


const admin = useAdminStore()

const searchQuery = ref('')
const categoryFilter = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | number>('')
const submitError = ref('')
const isSubmitting = ref(false)

const categories = ['Phone', 'Laptop', 'Headphone', 'Smart Watch', 'Tablet', 'Gaming', 'Accessories', 'Speaker']
const tags = ['New', 'Sale', 'Popular', 'Best Seller']

const form = reactive<ProductForm>({
  name: '',
  category: 'Phone',
  price: 0,
  discount: 0,
  tag: 'New',
  image: '',
  description: '',
  brand: '',
  stock: 0,
  rating: 0,
})

const route = useRoute()

onMounted(async () => {
  await admin.fetchProducts()
  if (route.query.action === 'create') {
    openCreate()
  }
})

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return (admin.products ?? []).filter((p) => {
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    const matchesCategory = !categoryFilter.value || p.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

function openCreate() {
  resetForm()
  isEditing.value = false
  editingId.value = ''
  submitError.value = ''
  showModal.value = true
}

function openEdit(product: any) {
  isEditing.value = true
  editingId.value = product.id
  form.name = product.name
  form.category = product.category
  form.price = Number(product.price)
  form.discount = Number(product.discount)
  form.tag = product.tag
  form.image = product.image
  form.description = product.description
  form.brand = product.brand
  form.stock = Number(product.stock)
  form.rating = Number(product.rating)
  submitError.value = ''
  showModal.value = true
}

function resetForm() {
  form.name = ''
  form.category = 'Phone'
  form.price = 0
  form.discount = 0
  form.tag = 'New'
  form.image = ''
  form.description = ''
  form.brand = ''
  form.stock = 0
  form.rating = 0
}

async function submitForm() {
  submitError.value = ''
  if (!form.name.trim()) {
    submitError.value = 'Product name is required.'
    return
  }
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await admin.updateProduct(editingId.value, { ...form })
    } else {
      await admin.createProduct({ ...form })
    }
    showModal.value = false
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    isSubmitting.value = false
  }
}

async function confirmDelete(product: any) {
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return
  try {
    await admin.deleteProduct(product.id)
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Unable to delete product.')
  }
}
</script>

<template>
  <div class="space-y-6 px-0 sm:px-6 ">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Products</h2>
        <p class="mt-1 text-sm text-slate-500">{{ admin.products.length }} products in your store.</p>
      </div>
      <button
        type="button"
        class="flex items-center mt-10 gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        @click="openCreate"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        Insert New Product
      </button>
    </div>

 

    <div class="flex flex-wrap gap-3">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search by name or brand..."
        class="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
      />
      <select
        v-model="categoryFilter"
        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div v-if="admin.isLoading" class="py-16 text-center text-sm font-semibold text-slate-500">
      Loading products...
    </div>

    <div
      v-else-if="admin.products.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"
    >
      <p class="font-semibold text-slate-600">No products yet.</p>
      <button
        type="button"
        class="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        @click="openCreate"
      >
        Add your first product
      </button>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-3.5">Product</th>
              <th class="px-5 py-3.5">Category</th>
              <th class="px-5 py-3.5">Price</th>
              <th class="px-5 py-3.5">Discount</th>
              <th class="px-5 py-3.5">Stock</th>
              <th class="px-5 py-3.5">Tag</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-slate-50/60">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <img :src="product.image" :alt="product.name" class="h-11 w-11 rounded-lg border border-slate-200 object-cover" />
                  <div class="min-w-0">
                    <p class="max-w-[220px] truncate font-semibold text-slate-800">{{ product.name }}</p>
                    <p class="max-w-[220px] truncate text-xs text-slate-500">{{ product.brand }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3 text-slate-600">{{ product.category }}</td>
              <td class="px-5 py-3 font-bold text-slate-900">${{ product.finalPrice.toLocaleString() }}</td>
              <td class="px-5 py-3 text-slate-600">{{ product.discount }}%</td>
              <td class="px-5 py-3">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="Number(product.stock) <= 5 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">{{ product.tag }}</span>
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100"
                    title="Update this product"
                    @click="openEdit(product)"
                  >
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Update
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                    title="Delete this product"
                    @click="confirmDelete(product)"
                  >
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="filteredProducts.length === 0" class="border-t border-slate-100 px-5 py-8 text-center text-sm text-slate-400">
        No products match your search.
      </p>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      @click.self="showModal = false"
    >
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">
            {{ isEditing ? 'Edit Product' : 'Add Product' }}
          </h3>
          <button
            type="button"
            class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            @click="showModal = false"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <p v-if="submitError" class="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-600">
          {{ submitError }}
        </p>

        <form class="space-y-4" @submit.prevent="submitForm">
          <div>
            <label class="mb-1.5 block text-xs font-bold text-slate-700">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Product name"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-700">Category</label>
              <select
                v-model="form.category"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-700">Brand</label>
              <input
                v-model="form.brand"
                type="text"
                placeholder="Brand"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-700">Price ($)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                required
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-700">Discount (%)</label>
              <input
                v-model.number="form.discount"
                type="number"
                min="0"
                max="100"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-700">Stock</label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                required
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-700">Rating</label>
              <input
                v-model.number="form.rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-bold text-slate-700">Tag</label>
            <select
              v-model="form.tag"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
            >
              <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-bold text-slate-700">Image URL</label>
            <input
              v-model="form.image"
              type="url"
              placeholder="https://..."
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-bold text-slate-700">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Product description"
              class="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-400"
            ></textarea>
          </div>

          <div v-if="form.image" class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <img :src="form.image" alt="preview" class="h-14 w-14 rounded-lg border border-slate-200 object-cover" />
            <span class="text-xs text-slate-500">Image preview</span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              class="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
              @click="showModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
