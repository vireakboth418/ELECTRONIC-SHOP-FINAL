<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productApi'

const route = useRoute()
const productStore = useProductStore()
const query = computed(() => typeof route.query.q === 'string' ? route.query.q.trim().toLowerCase() : '')
const results = computed(() => (productStore.productList ?? []).filter((product) => {
  const searchableText = `${product.name} ${product.description} ${product.category ?? ''} ${product.brand ?? ''}`.toLowerCase()
  return !query.value || searchableText.includes(query.value)
}))

onMounted(() => productStore.getAllProducts())
</script>

<template>
  <main class="min-h-screen bg-slate-50 py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <p class="text-sm font-semibold uppercase tracking-wider text-blue-600">Product search</p>
      <h1 class="mt-1 text-3xl font-bold text-slate-900">{{ query ? `Results for “${query}”` : 'Find a product' }}</h1>
      <p class="mt-2 text-slate-600">{{ results.length }} product{{ results.length === 1 ? '' : 's' }} found</p>

      <div v-if="productStore.isGetProductsLoading" class="py-12 text-center text-slate-600">Searching products...</div>
      <div v-else-if="!results.length" class="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm">
        <p class="text-lg font-medium text-slate-800">No products found.</p>
        <NuxtLink to="/product" class="mt-3 inline-block text-blue-600">View all products</NuxtLink>
      </div>
      <div v-else class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in results" :key="product.id" v-bind="product" />
      </div>
    </div>
  </main>
</template>
