<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productApi'

const route = useRoute()
const productStore = useProductStore()

// Search filtering logic
const searchTerm = computed(() => (typeof route.query.search === 'string' ? route.query.search.trim().toLowerCase() : ''))

const filteredProducts = computed(() => {
  return (productStore.productList ?? []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.value)
  )
})

onMounted(() => {
  productStore.getAllProducts()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 py-8 md:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Page Header -->
      <div class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {{ searchTerm ? `Search results for "${searchTerm}"` : 'All Products' }}
        </h1>
        
        <p v-if="!productStore.isGetProductsLoading" class="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Showing {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }}
        </p>
      </div>

      <!-- Loading State (Skeleton Grid) -->
      <div
        v-if="productStore.isGetProductsLoading"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div class="aspect-square w-full rounded-xl bg-slate-200"></div>
          <div class="mt-4 h-4 w-3/4 rounded bg-slate-200"></div>
          <div class="mt-2 h-3 w-1/2 rounded bg-slate-200"></div>
          <div class="mt-6 flex items-center justify-between">
            <div class="h-6 w-1/3 rounded bg-slate-200"></div>
            <div class="h-9 w-1/3 rounded-xl bg-slate-200"></div>
          </div>
        </div>
      </div>

      <!-- Main Product Grid -->
      <div
        v-else-if="filteredProducts.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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

      <!-- Empty State -->
      <div
        v-else
        class="flex min-h-200 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-bold text-slate-900">No products found</h3>
        <p class="mt-1 text-xs text-slate-500">
          We couldn't find any products matching "{{ searchTerm }}".
        </p>
      </div>

    </div>
  </div>
</template>