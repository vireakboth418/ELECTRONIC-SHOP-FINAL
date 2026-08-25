<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productApi'

const productStore = useProductStore()
const featuredProducts = computed(() => (productStore.productList ?? []).slice(0, 4))

onMounted(() => productStore.getAllProducts())
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <section
      class="relative isolate overflow-hidden bg-slate-900"
      style="background-image: url('https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2000&q=85'); background-position: center; background-size: cover;"
    >
      <div class="absolute inset-0 -z-10 bg-slate-950/70"></div>
      <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div class="max-w-2xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">New technology, made simple</p>
          <h1 class="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">Find tech you’ll love.</h1>
          <p class="mt-6 max-w-xl text-lg leading-8 text-slate-200">Discover powerful phones, laptops, audio gear, gaming devices, and more—picked for everyday life.</p>
          <div class="mt-9 flex flex-wrap gap-4">
            <NuxtLink to="/product" class="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500">Shop all products</NuxtLink>
            <NuxtLink to="/register" class="rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/20">Create account</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wider text-blue-600">Popular picks</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-900">Featured products</h2>
        </div>
        <NuxtLink to="/product" class="font-semibold text-blue-600 hover:text-blue-700">View all products →</NuxtLink>
      </div>

      <div v-if="productStore.isGetProductsLoading" class="py-12 text-center text-slate-600">Loading products...</div>
      <div v-else class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in featuredProducts" :key="product.id" v-bind="product" />
      </div>
    </section>
  </main>
</template>
