<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
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
const loadError = ref<string | null>(null)

// Interactive states
const selectedQuantity = ref(1)
const isLiked = ref(false)
const imageError = ref(false)
const isAddedNotification = ref(false)
const isCopiedNotification = ref(false)

onMounted(async () => {
  auth.initialize()

  if (!productId) {
    loadError.value = 'Invalid product id.'
    return
  }

  try {
    product.value = await productStore.getProductById(productId)
  } catch (err) {
    loadError.value = 'Something went wrong loading this product.'
  }
})

// --- Safe derived fields ---
// These fall back gracefully if the API/product object doesn't include them,
// instead of throwing or rendering "undefined".
const rating = computed(() => Number(product.value?.rating ?? 0))
const reviewCount = computed(() => Number(product.value?.reviewCount ?? 0))
const orderCount = computed(() => Number(product.value?.orderCount ?? 0))
const shareCount = computed(() => Number(product.value?.shareCount ?? 0))
const wishlistCount = computed(() => Number(product.value?.wishlistCount ?? 0) + (isLiked.value ? 1 : 0))

const price = computed(() => Number(product.value?.price ?? 0))
const totalPrice = computed(() => (price.value * selectedQuantity.value).toFixed(2))

const starArray = computed(() => Array.from({ length: 5 }, (_, i) => i < Math.round(rating.value)))

// Stock is optional on Product — only enforce a ceiling when it's actually present
const stock = computed(() => (product.value as any)?.stock as number | undefined)
const isOutOfStock = computed(() => stock.value !== undefined && stock.value <= 0)
const canIncreaseQuantity = computed(() => stock.value === undefined || selectedQuantity.value < stock.value)

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
  const next = selectedQuantity.value + amount
  if (next < 1) return
  if (stock.value !== undefined && next > stock.value) return
  selectedQuantity.value = next
}

function requireAuth(): boolean {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return false
  }
  return true
}

function handleAddToCart() {
  if (!requireAuth() || !product.value || isOutOfStock.value) return

  for (let i = 0; i < selectedQuantity.value; i++) {
    cart.addProduct(product.value)
  }

  isAddedNotification.value = true
  setTimeout(() => {
    isAddedNotification.value = false
  }, 2500)
}

function handleBuyNow() {
  if (!requireAuth() || !product.value || isOutOfStock.value) return

  for (let i = 0; i < selectedQuantity.value; i++) {
    cart.addProduct(product.value)
  }
  router.push('/checkout')
}

function handleChat() {
  if (!requireAuth()) return
  router.push({ path: '/chat', query: { productId: product.value?.id } })
}

async function handleShare() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    isCopiedNotification.value = true
    setTimeout(() => {
      isCopiedNotification.value = false
    }, 2000)
  } catch {
    // Clipboard API unavailable — fail silently, nothing to add to cart etc.
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

    <!-- Error / Not Found State -->
    <div v-else-if="!product" class="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="mt-4 text-2xl font-bold text-slate-900">
        {{ loadError ? 'Something Went Wrong' : 'Product Not Found' }}
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        {{ loadError || 'The product you are looking for does not exist or has been removed.' }}
      </p>
      <RouterLink to="/product" class="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700">
        Back to Products
      </RouterLink>
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

      <div class="overflow-hidden rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">

          <!-- Product Image -->
          <div class="relative flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-8 lg:col-span-5">
            <img
              v-if="!imageError"
              :src="product.image"
              :alt="product.name"
              class="max-h-72 w-auto object-contain"
              @error="imageError = true"
            />
            <div v-else class="flex h-64 w-full items-center justify-center text-slate-300">
              <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Share badge, top right -->
            <button
              type="button"
              aria-label="Copy product link"
              class="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-blue-600"
              @click="handleShare"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 100-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {{ shareCount }}
            </button>
          </div>

          <!-- Product Info -->
          <div class="flex flex-col justify-center lg:col-span-7">
            <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {{ product.name }}
            </h1>

            <!-- Rating / reviews / orders / wishlist row -->
            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <div class="flex items-center gap-0.5">
                <svg
                  v-for="(filled, i) in starArray"
                  :key="i"
                  class="h-4 w-4"
                  :class="filled ? 'fill-orange-400 text-orange-400' : 'fill-orange-100 text-orange-200'"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                </svg>
                <span class="ml-1 text-slate-400">({{ rating }})</span>
              </div>
              <span class="text-slate-300">|</span>
              <span class="font-semibold text-blue-600">{{ reviewCount }} Reviews</span>
              <span class="text-slate-300">|</span>
              <span class="font-semibold text-blue-600">{{ orderCount }} Orders</span>
              <span class="text-slate-300">|</span>
              <span class="font-semibold text-blue-600">{{ wishlistCount }} Wish Listed</span>
            </div>

            <!-- Price -->
            <p class="mt-4 text-3xl font-black text-blue-600">${{ price.toFixed(2) }}</p>
            <p v-if="isOutOfStock" class="mt-1 text-xs font-bold uppercase tracking-wider text-red-500">
              Out of stock
            </p>

            <!-- Description -->
            <p v-if="product.description" class="mt-4 text-sm leading-relaxed text-slate-600">
              {{ product.description }}
            </p>

            <div class="my-6 h-px bg-slate-100"></div>

            <!-- Quantity + Wishlist -->
            <div class="flex flex-wrap items-center gap-4">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</span>
              <div class="flex items-center rounded-xl border border-blue-500 bg-slate-50/50 p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="selectedQuantity <= 1"
                  @click="updateQuantity(-1)"
                >
                  -
                </button>
                <span class="w-10 text-center text-sm font-bold text-slate-900">{{ selectedQuantity }}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!canIncreaseQuantity"
                  @click="updateQuantity(1)"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                aria-label="Toggle wishlist"
                class="flex items-center justify-center gap-2 rounded-xl border px-6 py-4 text-sm font-bold shadow-sm transition-all duration-200 active:scale-[0.98]"
                :class="isLiked
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'"
                @click="toggleLike"
              >
                <svg
                  class="h-4 w-4"
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
                {{ wishlistCount }}
              </button>
            </div>

            <!-- Total price -->
            <p class="mt-4 text-sm text-slate-700">
              Total Price :
              <span class="font-bold text-blue-600">${{ totalPrice }}</span>
            </p>

            <!-- Actions -->
            <div class="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                class="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 active:scale-[0.98]"
                @click="handleChat"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat
              </button>

              <button
                type="button"
                class="flex-1 rounded-xl border-2 border-blue-600 px-6 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="isOutOfStock"
                @click="handleAddToCart"
              >
                Add to cart
              </button>

            
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toasts -->
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

    <Transition name="fade">
      <div v-if="isCopiedNotification" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl backdrop-blur-xl">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
          ✓
        </div>
        <p class="text-xs font-bold">Link copied to clipboard!</p>
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