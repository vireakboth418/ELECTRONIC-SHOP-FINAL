<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productApi'

const route = useRoute()
const productStore = useProductStore()

const selectedCategory = ref('')

// Get search query from URL
const searchQuery = computed(() => {
  return typeof route.query.search === 'string'
    ? route.query.search.trim()
    : ''
})

// Filter products based on search
const filteredProducts = computed(() => {
  return (productStore.productList ?? []).filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Get unique categories from products
const categories = computed(() => {
  return Array.from(new Set((productStore.productList ?? []).map((p) => p.category)))
})

// Group products by category
const groupedProducts = computed(() => {
  const list = productStore.productList ?? []
  const groups: Record<string, typeof list> = {}
  list.forEach((product) => {
    if (!groups[product.category]) {
      groups[product.category] = []
    }
    groups[product.category].push(product)
  })
  return groups
})

// Get all products when page loads
onMounted(() => {
  productStore.getAllProducts()
})
</script>

<template>

  <div
    v-if="productStore.isGetProductsLoading"
    class="flex min-h-screen items-center justify-center"
  >
    <h1 class="text-2xl font-bold">
      Loading...
    </h1>
  </div>

  <!-- Main Content -->
  <div v-else class="mx-auto max-w-7xl px-4 py-8">

    <!-- ================= SEARCH RESULT ================= -->

    <template v-if="searchQuery">

      <h1 class="py-10 text-2xl font-bold">
        Search results for: "{{ searchQuery }}"
      </h1>

      <p class="px-10 text-gray-600">
        {{ filteredProducts.length }}
        product{{ filteredProducts.length === 1 ? '' : 's' }} found
      </p>

      <!-- Products Found -->
      <div
        v-if="filteredProducts.length > 0"
        class="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 lg:grid-cols-5"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :id="product.id"
          :name="product.name"
          :price="product.finalPrice"
          :description="product.description"
          :image="product.image"
          :category="product.category"
          :inStock="product.stock > 0"
        />
      </div>

      <!-- No Products Found -->
      <div
        v-else
        class="flex min-h-100 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"
      >
        <div
          class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl"
        >
          🔍
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          No products found
        </h3>

        <p class="mt-1 text-sm text-slate-500">
          We couldn't find any products matching
          "{{ searchQuery }}".
        </p>
      </div>

    </template>


    <!-- ================= GROUPED BY CATEGORY ================= -->

    <template v-else>
      <h1 class="py-5 text-2xl font-bold">
        All Products
      </h1>

      <!-- Category Filter Tags -->
      <div class="flex flex-wrap gap-3 pb-6">
        <button
          type="button"
          @click="selectedCategory = ''"
          :class="selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="cursor-pointer rounded-sm px-5 py-1.5 text-sm font-medium transition-colors duration-200"
        >
          All Categories
        </button>
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          @click="selectedCategory = category"
          :class="selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="cursor-pointer rounded-sm px-5 py-1.5 text-sm font-medium transition-colors duration-200"
        >
          {{ category }}
        </button>
      </div>

      <!-- Render filtered or all grouped categories -->
      <div
        v-if="selectedCategory"
        class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5"
      >
        <ProductCard
          v-for="product in groupedProducts[selectedCategory] ?? []"
          :key="product.id"
          :id="product.id"
          :name="product.name"
          :price="product.finalPrice"
          :description="product.description"
          :image="product.image"
          :category="product.category"
          :inStock="product.stock > 0"
        />
      </div>

      <div v-else>
        <div
          v-for="category in categories"
          :key="category"
          class="mb-10"
        >
          <h2 class="mb-4 text-xl font-bold text-slate-800">{{ category }}</h2>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <ProductCard
              v-for="product in groupedProducts[category] ?? []"
              :key="product.id"
              :id="product.id"
              :name="product.name"
              :price="product.finalPrice"
              :description="product.description"
              :image="product.image"
              :category="product.category"
              :inStock="product.stock > 0"
            />
          </div>
        </div>
      </div>

    </template>

  </div>
</template>
