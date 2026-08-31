<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/productApi'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import type { Product } from '../type/product'

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()
const auth = useAuthStore()
const cart = useCartStore()

const productId = Number(route.query.id)
const product = ref<Product | null>(null)

// Interactive States
const selectedQuantity = ref(1)
const isLiked = ref(false)
const imageError = ref(false)
const isAddedNotification = ref(false)

onMounted(async () => {
  auth.initialize()
  if (productId) {
    product.value = await productStore.getProductById(productId)
  }
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/product')
  }
}

function toggleLike() {
  isLiked.value = !isLiked.value
}

function updateQuantity(amount: number) {
  if (selectedQuantity.value + amount >= 1) {
    selectedQuantity.value += amount
  }
}

function handleAddToCart() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  
  if (product.value) {
    // Add product according to selected quantity
    for (let i = 0; i < selectedQuantity.value; i++) {
      cart.addProduct(product.value)
    }

    // Show floating toast notification
    isAddedNotification.value = true
    setTimeout(() => {
      isAddedNotification.value = false
    }, 2500)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 py-8 md:py-12">
    <!-- Loading State -->
    <div v-if="productStore.isloading" class="flex min-h-[60vh] flex-col items-center justify-center">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p class="mt-4 text-sm font-semibold text-slate-500">Loading product details...</p>
    </div>

    <!-- Product Not Found State -->
    <div v-else-if="!product" class="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="mt-4 text-2xl font-bold text-slate-900">Product Not Found</h1>
      <p class="mt-1 text-sm text-slate-500">The product you are looking for does not exist or has been removed.</p>
      <NuxtLink to="/product" class="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700">
        Back to Products
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div v-else class="mx-auto max-w-6xl px-4 sm:px-6">
      
      <!-- Back Button -->
      <button
        type="button"
        class="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600 active:scale-95"
        @click="goBack"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <div class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          
          <!-- Product Image -->
          <div class="flex flex-col gap-4 lg:col-span-5">
            <div class="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <img
                v-if="!imageError"
                :src="product.image"
                :alt="product.name"
                class="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                @error="imageError = true"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Top Category Badge -->
              <span class="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                Electronics
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex flex-col justify-between lg:col-span-7">
            <div>
              <!-- Stock Status & Wishlist Button -->
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                  In Stock
                </span>

                <!-- Heart / Wishlist Reactive Button -->
                <button
                  type="button"
                  aria-label="Add to Wishlist"
                  class="group flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 active:scale-90"
                  :class="isLiked ? 'border-rose-200 bg-rose-50 text-rose-500 shadow-md shadow-rose-500/10' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'"
                  @click="toggleLike"
                >
                  <svg
                    class="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    :class="{ 'fill-current': isLiked }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                </button>
              </div>

              <!-- Title -->
              <h1 class="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {{ product.name }}
              </h1>

              <!-- Price -->
              <div class="mt-4 flex items-baseline gap-3">
                <span class="text-3xl font-black text-slate-900">${{ product.price }}</span>
              </div>

              <!-- Description -->
              <p class="mt-4 text-sm leading-relaxed text-slate-600">
                {{ product.description }}
              </p>

              <div class="my-6 h-px bg-slate-100"></div>

              <!-- Quantity Selector -->
              <div class="flex items-center gap-4">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</span>
                <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 p-1">
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-100"
                    @click="updateQuantity(-1)"
                  >
                    -
                  </button>
                  <span class="w-10 text-center text-sm font-bold text-slate-900">{{ selectedQuantity }}</span>
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-100"
                    @click="updateQuantity(1)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/35 active:scale-[0.98]"
                @click="handleAddToCart"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add {{ selectedQuantity }} to Cart • ${{ product.price * selectedQuantity }}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <Transition name="fade">
      <div v-if="isAddedNotification && product" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl backdrop-blur-xl">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
          ✓
        </div>
        <div>
          <p class="text-xs font-bold">Added to Cart!</p>
          <p class="text-[11px] text-slate-400">{{ selectedQuantity }}x {{ product.name }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>