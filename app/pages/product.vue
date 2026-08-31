<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productApi'

const route = useRoute()
const productStore = useProductStore()

// Get search query from URL
const searchTerm = computed(() => {
  return typeof route.query.search === 'string'
    ? route.query.search.trim().toLowerCase()
    : ''
})

// Filter products based on search
const filteredProducts = computed(() => {
  return (productStore.productList ?? []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.value)
  )
})

// Get Smartphone products
const smartphones = computed(() => {
  return (productStore.productList ?? []).filter(
    (product) => product.category === 'Phone'
  )
})

// Get all products when page loads
onMounted(() => {
  productStore.getAllProducts()
})
</script>

<template>
  <!-- Loading -->
  <div
    v-if="productStore.isGetProductsLoading"
    class="flex min-h-screen items-center justify-center"
  >
    <h1 class="text-2xl font-bold">
      Loading...
    </h1>
  </div>

  <!-- Main Content -->
  <div v-else>

    <!-- ================= SEARCH RESULT ================= -->

    <template v-if="searchTerm">

      <h1 class="py-10 pl-30 text-2xl font-bold">
        Search results for: {{ searchTerm }}
      </h1>

      <p class="px-10 text-gray-600">
        {{ filteredProducts.length }}
        product{{ filteredProducts.length === 1 ? '' : 's' }} found
      </p>

      <!-- Products Found -->
      <div
        v-if="filteredProducts.length > 0"
        class="grid grid-cols-1 gap-4 md:m-10 md:grid-cols-3 lg:m-15 lg:grid-cols-4"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :id="product.id"
          :name="product.name"
          :price="product.price"
          :description="product.description"
          :image="product.image"
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
          "{{ searchTerm }}".
        </p>
      </div>

    </template>


    <!-- ================= SMARTPHONE ================= -->

    <template v-else>

      <h1 class="py-10 pl-30 text-2xl font-bold">
        Smart Phone
      </h1>

      <div
        v-if="smartphones.length > 0"
        class="grid grid-cols-1 gap-4 md:m-10 md:grid-cols-3 lg:m-15 lg:grid-cols-4"
      >
        <ProductCard
          v-for="product in smartphones"
          :key="product.id"
          :id="product.id"
          :name="product.name"
          :price="product.price"
          :description="product.description"
          :image="product.image"
        />
      </div>

      <!-- No Smartphones -->
      <div
        v-else
        class="flex min-h-100 items-center justify-center"
      >
        <h2 class="text-xl font-bold text-gray-500">
          No smartphones available
        </h2>
      </div>

    </template>

  </div>
</template> 