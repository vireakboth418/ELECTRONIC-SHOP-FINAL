<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '../stores/counter'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useProductStore } from '../stores/productApi'
import type { Product } from '../type/product'
import { navigateTo } from '#app'

const counter = useCounterStore()
const auth = useAuthStore()
const cart = useCartStore()
const productStore = useProductStore()
const route = useRoute()
const searchQuery = ref('')
const isMobileMenuOpen = ref(false)

const searchResults = computed(() => {
  const searchTerm = searchQuery.value.trim().toLowerCase()
  if (!searchTerm) return []
  return (productStore.productList ?? [])
    .filter((product) => product.name.toLowerCase().includes(searchTerm))
    .slice(0, 5)
})

onMounted(() => {
  auth.initialize()
  if (!productStore.productList) productStore.getAllProducts()
})

function logout() {
  auth.logout()
  isMobileMenuOpen.value = false
  navigateTo('/')
}

function search() {
  const query = searchQuery.value.trim()
  isMobileMenuOpen.value = false
  navigateTo({ path: '/product', query: query ? { search: query } : {} })
}

function selectProduct(product: Product) {
  searchQuery.value = ''
  isMobileMenuOpen.value = false
  navigateTo(`/productdetail?id=${product.id}`)
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto max-w-7xl px-4">
      <div class="flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="shrink-0 text-xl font-bold text-blue-600" @click="closeMobileMenu">MyApp {{ counter.count }}</NuxtLink>

        <form class="relative hidden max-w-md flex-1 md:flex" @submit.prevent="search">
          <label class="sr-only" for="desktop-search">Search products</label>
          <input id="desktop-search" v-model="searchQuery" type="search" placeholder="Search products..." class="min-w-0 flex-1 rounded-l-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <button type="submit" class="rounded-r-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Search</button>
          <div v-if="searchQuery.trim()" class="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <button v-for="product in searchResults" :key="product.id" type="button" class="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50" @click="selectProduct(product)">
              <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-lg object-cover" />
              <span class="min-w-0"><span class="block truncate font-medium text-slate-800">{{ product.name }}</span><span class="text-sm text-blue-600">${{ product.price }}</span></span>
            </button>
            <p v-if="!searchResults.length" class="px-4 py-3 text-sm text-slate-500">No product names match “{{ searchQuery }}”.</p>
          </div>
        </form>

        <div class="hidden items-center gap-5 md:flex">
          <NuxtLink to="/" class="text-sm font-medium text-slate-600 hover:text-blue-600">Home</NuxtLink>
          <NuxtLink to="/product" class="text-sm font-medium text-slate-600 hover:text-blue-600">Products</NuxtLink>
          <NuxtLink to="/about" class="text-sm font-medium text-slate-600 hover:text-blue-600">About</NuxtLink>
          <NuxtLink to="/cart" class="text-sm font-medium text-slate-600 hover:text-blue-600">Cart ({{ cart.itemCount }})</NuxtLink>
          <template v-if="auth.isAuthenticated">
            <span class="text-sm text-slate-600">Hi, {{ auth.user?.name }}</span>
            <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100" @click="logout">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-sm font-medium text-blue-600">Login</NuxtLink>
            <NuxtLink to="/register" class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Register</NuxtLink>
          </template>
        </div>

        <button class="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" :aria-expanded="isMobileMenuOpen" aria-label="Toggle navigation menu" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <svg v-if="!isMobileMenuOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div v-if="isMobileMenuOpen" class="absolute left-0 right-0 border-y border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
        <form class="relative mb-4 flex" @submit.prevent="search">
          <label class="sr-only" for="mobile-search">Search products</label>
          <input id="mobile-search" v-model="searchQuery" type="search" placeholder="Search products..." class="min-w-0 flex-1 rounded-l-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <button type="submit" class="rounded-r-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">Search</button>
          <div v-if="searchQuery.trim()" class="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <button v-for="product in searchResults" :key="product.id" type="button" class="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50" @click="selectProduct(product)">
              <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-lg object-cover" />
              <span class="min-w-0"><span class="block truncate font-medium text-slate-800">{{ product.name }}</span><span class="text-sm text-blue-600">${{ product.price }}</span></span>
            </button>
            <p v-if="!searchResults.length" class="px-4 py-3 text-sm text-slate-500">No product names match “{{ searchQuery }}”.</p>
          </div>
        </form>
        <div class="grid gap-1">
          <NuxtLink to="/" class="rounded-lg px-3 py-2 hover:bg-slate-100" @click="closeMobileMenu">Home</NuxtLink>
          <NuxtLink to="/product" class="rounded-lg px-3 py-2 hover:bg-slate-100" @click="closeMobileMenu">Products</NuxtLink>
          <NuxtLink to="/about" class="rounded-lg px-3 py-2 hover:bg-slate-100" @click="closeMobileMenu">About</NuxtLink>
          <NuxtLink to="/cart" class="rounded-lg px-3 py-2 hover:bg-slate-100" @click="closeMobileMenu">Cart ({{ cart.itemCount }})</NuxtLink>
          <template v-if="auth.isAuthenticated">
            <p class="px-3 py-2 text-sm text-slate-500">Signed in as {{ auth.user?.name }}</p>
            <button class="rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50" @click="logout">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50" @click="closeMobileMenu">Login</NuxtLink>
            <NuxtLink to="/register" class="rounded-lg bg-blue-600 px-3 py-2 text-center font-medium text-white hover:bg-blue-700" @click="closeMobileMenu">Register</NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
