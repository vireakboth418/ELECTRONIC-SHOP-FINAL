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
const selectedCategory = ref('')
const isMobileMenuOpen = ref(false)
const isCategoryDropdownOpen = ref(false)
const isUserDropdownOpen = ref(false)

const categories = ref([
  'All Categories',
  'Laptops',
  'Smartphones',
  'Accessories',
  'Audio',
  'Gaming'
])

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
  isUserDropdownOpen.value = false
  navigateTo('/')
}

function search() {
  const query = searchQuery.value.trim()
  const category = selectedCategory.value && selectedCategory.value !== 'All Categories' ? selectedCategory.value : undefined
  isMobileMenuOpen.value = false
  
  navigateTo({ 
    path: '/product', 
    query: { 
      ...(query ? { search: query } : {}),
      ...(category ? { category: category } : {})
    } 
  })
}

function selectProduct(product: Product) {
  searchQuery.value = ''
  isMobileMenuOpen.value = false
  navigateTo(`/productdetail?id=${product.id}`)
}

function selectCategory(category: string) {
  selectedCategory.value = category === 'All Categories' ? '' : category
  isCategoryDropdownOpen.value = false
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full font-sans">
    <!-- Semi-transparent Background with High Blur Effect -->
    <nav class="relative border-b border-slate-300/60 bg-slate-100/75 backdrop-blur-xl shadow-sm transition-all duration-300">
      
      <!-- Subtle Blue Ambient Glow Effects -->
      <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute -top-10 left-1/4 h-36 w-36 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div class="absolute -top-10 right-1/4 h-36 w-36 rounded-full bg-blue-500/15 blur-3xl"></div>
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="flex h-16 items-center justify-between gap-4 md:gap-8">
          
          <!-- Brand Logo -->
          <NuxtLink to="/" class="group flex shrink-0 items-center gap-3 focus:outline-none" @click="closeMobileMenu">
            <!-- SVG Cart + Circuit Vector -->
            <svg class="h-9 w-auto" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 24H35L52 62H102L118 36" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="58" cy="72" r="5" fill="none" stroke="#1E293B" stroke-width="4"/>
              <circle cx="96" cy="72" r="5" fill="none" stroke="#1E293B" stroke-width="4"/>
              
              <line x1="48" y1="52" x2="68" y2="20" stroke="#154B9C" stroke-width="4" stroke-linecap="round"/>
              <circle cx="68" cy="20" r="4" fill="white" stroke="#154B9C" stroke-width="3"/>

              <line x1="65" y1="52" x2="92" y2="12" stroke="#1E3A8A" stroke-width="4" stroke-linecap="round"/>
              <circle cx="92" cy="12" r="4" fill="white" stroke="#1E3A8A" stroke-width="3"/>

              <line x1="82" y1="52" x2="114" y2="10" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
              <circle cx="114" cy="10" r="4" fill="white" stroke="#1E3A8A" stroke-width="3"/>
            </svg>

            <div class="flex items-center text-xl font-extrabold tracking-tight">
              <span class="text-[#154B9C]">KHMER</span>
              <span class="text-[#DC2626]">ES</span>
            </div>
          </NuxtLink>

          <!-- Search Bar -->
          <form class="relative hidden max-w-xl flex-1 items-center md:flex" @submit.prevent="search">
            <div class="flex w-full items-center overflow-hidden rounded-xl border border-slate-300/80 bg-slate-200/50 p-1 shadow-inner backdrop-blur-md transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
              
              <!-- Category Dropdown -->
              <div class="relative border-r border-slate-300/80">
                <button 
                  type="button" 
                  class="flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
                >
                  <span class="max-w-[130px] truncate">{{ selectedCategory || 'All Categories' }}</span>
                  <svg class="h-3.5 w-3.5 text-slate-500 transition-transform duration-200" :class="{ 'rotate-180': isCategoryDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div v-if="isCategoryDropdownOpen" class="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-xl">
                  <button
                    v-for="cat in categories"
                    :key="cat"
                    type="button"
                    class="flex w-full items-center rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    @click="selectCategory(cat)"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>

              <!-- Input -->
              <label class="sr-only" for="desktop-search">Search products</label>
              <input 
                id="desktop-search" 
                v-model="searchQuery" 
                type="search" 
                placeholder="Search products..." 
                class="min-w-0 flex-1 bg-transparent px-3 text-xs font-medium text-slate-800 placeholder-slate-500 outline-none" 
              />
              
              <!-- Search Button with Blue Color and Hover Transition -->
              <button type="submit" class="flex h-9 items-center gap-1.5 rounded-lg bg-[#154B9C] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Search
              </button>
            </div>

            <!-- Auto-complete Results -->
            <div v-if="searchQuery.trim()" class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl backdrop-blur-xl">
              <button v-for="product in searchResults" :key="product.id" type="button" class="group flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-blue-50" @click="selectProduct(product)">
                <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded border border-slate-200 object-cover" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-semibold text-slate-800 group-hover:text-blue-600">{{ product.name }}</span>
                  <span class="text-xs font-bold text-blue-600">${{ product.price }}</span>
                </span>
              </button>
              <p v-if="!searchResults.length" class="px-3 py-3 text-center text-xs font-medium text-slate-500">No products match “{{ searchQuery }}”.</p>
            </div>
          </form>

          <!-- Navigation Links -->
          <div class="hidden items-center gap-6 md:flex">
            <div class="flex items-center gap-6 text-xs font-semibold text-slate-700">
              <NuxtLink to="/" class="transition-colors hover:text-blue-600">Home</NuxtLink>
              <NuxtLink to="/product" class="transition-colors hover:text-blue-600">Products</NuxtLink>
              <NuxtLink to="/contact" class="transition-colors hover:text-blue-600">Contact</NuxtLink>
              <NuxtLink to="/about" class="transition-colors hover:text-blue-600">About</NuxtLink>
            </div>

            <div class="h-5 w-px bg-slate-300"></div>

            <div class="flex items-center gap-3">
              <!-- Cart Link -->
              <NuxtLink to="/cart" class="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-slate-200/60 text-slate-700 shadow-xs transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span v-if="cart.itemCount > 0" class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-[11px] font-bold text-white shadow-xs">
                  {{ cart.itemCount }}
                </span>
              </NuxtLink>

              <!-- Auth Section -->
              <template v-if="auth.isAuthenticated">
                <div class="relative">
                  <button type="button" class="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-200/60 p-1.5 pr-3 transition-colors hover:border-blue-300 hover:bg-blue-50" @click="isUserDropdownOpen = !isUserDropdownOpen">
                    <div class="flex h-7 w-7 items-center justify-center rounded bg-[#154B9C] text-xs font-bold text-white uppercase">
                      {{ auth.user?.name?.[0] || 'U' }}
                    </div>
                    <span class="max-w-[120px] truncate text-xs font-semibold text-slate-800">{{ auth.user?.name }}</span>
                  </button>
                  <div v-if="isUserDropdownOpen" class="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-xl">
                    <button class="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50" @click="logout">Logout</button>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center gap-2">
                  <NuxtLink to="/login" class="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600">Login</NuxtLink>
                  <!-- Register Button with Blue Theme -->
                  <NuxtLink to="/register" class="rounded-lg bg-[#154B9C] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95">Register</NuxtLink>
                </div>
              </template>
            </div>
          </div>

          <!-- Mobile Hamburger -->
          <button class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-slate-200/60 text-slate-700 hover:text-blue-600 md:hidden" :aria-expanded="isMobileMenuOpen" aria-label="Toggle menu" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <svg v-if="!isMobileMenuOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <!-- Mobile Drawer Menu -->
        <div v-if="isMobileMenuOpen" class="absolute left-0 right-0 border-b border-slate-300 bg-slate-100/95 px-4 py-4 shadow-xl backdrop-blur-xl md:hidden">
          <form class="relative mb-4" @submit.prevent="search">
            <div class="flex items-center overflow-hidden rounded-lg border border-slate-300 bg-slate-200/60 p-1">
              <input id="mobile-search" v-model="searchQuery" type="search" placeholder="Search products..." class="w-full bg-transparent px-3 py-1.5 text-xs font-medium text-slate-800 outline-none" />
              <button type="submit" class="rounded-md bg-[#154B9C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Search</button>
            </div>
            
            <div v-if="searchQuery.trim()" class="relative mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button v-for="product in searchResults" :key="product.id" type="button" class="flex w-full items-center gap-3 border-b border-slate-200 p-2.5 text-left hover:bg-blue-50 last:border-none" @click="selectProduct(product)">
                <img :src="product.image" :alt="product.name" class="h-9 w-9 rounded object-cover" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-semibold text-slate-800">{{ product.name }}</span>
                  <span class="text-xs font-bold text-blue-600">${{ product.price }}</span>
                </span>
              </button>
            </div>
          </form>

          <div class="flex flex-col gap-1 font-semibold text-slate-700">
            <NuxtLink to="/" class="rounded-lg px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600" @click="closeMobileMenu">Home</NuxtLink>
            <NuxtLink to="/product" class="rounded-lg px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600" @click="closeMobileMenu">Products</NuxtLink>
            <NuxtLink to="/contact" class="rounded-lg px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600" @click="closeMobileMenu">Contact</NuxtLink>
            <NuxtLink to="/about" class="rounded-lg px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600" @click="closeMobileMenu">About</NuxtLink>
            
            <NuxtLink to="/cart" class="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600" @click="closeMobileMenu">
              <span>Cart</span>
              <span class="rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-bold text-white">{{ cart.itemCount }}</span>
            </NuxtLink>

            <div class="my-2 h-px bg-slate-300"></div>

            <template v-if="auth.isAuthenticated">
              <div class="px-3 py-1 text-xs text-slate-500"><span class="font-bold text-slate-800">{{ auth.user?.name }}</span></div>
              <button class="rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50" @click="logout">Logout</button>
            </template>
            <template v-else>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <NuxtLink to="/login" class="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-200/70 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600" @click="closeMobileMenu">Login</NuxtLink>
                <NuxtLink to="/register" class="flex items-center justify-center rounded-lg bg-[#154B9C] py-2 text-center text-xs font-semibold text-white hover:bg-blue-700" @click="closeMobileMenu">Register</NuxtLink>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>