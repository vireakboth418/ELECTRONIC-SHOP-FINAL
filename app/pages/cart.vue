<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const orderPlaced = ref(false)
const total = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

onMounted(() => {
  auth.initialize()
  if (!auth.isAuthenticated) {
    router.replace({ path: '/login', query: { redirect: '/cart' } })
  }
})

function placeOrder() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: '/cart' } })
    return
  }
  if (!cart.items.length) return
  cart.clearCart()
  orderPlaced.value = true
}

function increaseQuantity(id: string, quantity: number) {
  cart.updateQuantity(id, quantity + 1)
}

function decreaseQuantity(id: string, quantity: number) {
  cart.updateQuantity(id, quantity - 1)
}
</script>

<template>
  <main class="min-h-screen bg-slate-50/50 py-8 md:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Order Placed Success View -->
      <div v-if="orderPlaced" class="mx-auto max-w-md rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="mt-4 text-2xl font-black text-slate-900">Order Confirmed!</h1>
        <p class="mt-2 text-xs leading-relaxed text-slate-500">
          Thanks for your purchase, <strong class="text-slate-700">{{ auth.user?.name || 'Customer' }}</strong>. We sent your order confirmation email.
        </p>
        <NuxtLink
          to="/product"
          class="mt-6 inline-block w-full rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98]"
        >
          Continue Shopping
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between border-b border-slate-200/80 pb-6">
          <div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Shopping Cart</h1>
            <p class="mt-1 text-xs font-medium text-slate-500">Review your selected items before checkout.</p>
          </div>
          <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
            {{ cart.itemCount }} {{ cart.itemCount === 1 ? 'item' : 'items' }}
          </span>
        </div>

        <!-- Empty Cart -->
        <div v-if="!cart.items.length" class="flex min-h:[150px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-bold text-slate-900">Your cart is empty</h3>
          <p class="mt-1 text-xs text-slate-500">Looks like you haven't added anything to your cart yet.</p>
          <NuxtLink
            to="/product"
            class="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700"
          >
            Explore Products
          </NuxtLink>
        </div>

        <!-- Split View: Left List / Right Summary -->
        <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          <!-- Left Column: Item List (8 Columns) -->
          <div class="lg:col-span-8">
            <div class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
              <div class="divide-y divide-slate-100">
                <div
                  v-for="item in cart.items"
                  :key="item.id"
                  class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div class="flex items-center gap-4">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="h-20 w-20 flex-shrink:0 rounded-2xl border border-slate-100 bg-slate-50 object-cover sm:h-24 sm:w-24"
                    />
                    <div>
                      <h3 class="text-base font-bold text-slate-900">{{ item.name }}</h3>
                      <p class="mt-0.5 text-xs font-semibold text-slate-400">${{ item.price.toFixed(2) }} each</p>
                      
                      <button
                        type="button"
                        class="mt-2 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                        @click="cart.updateQuantity(item.id, 0)"
                      >
                        Remove 
                      </button>
                    </div>
                  </div>

                  <div class="flex items-center justify-between gap-6 sm:justify-end">
                    <!-- Quantity Stepper -->
                    <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 p-1">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100"
                        @click="decreaseQuantity(item.id, item.quantity)"
                      >
                        -
                      </button>
                      <span class="w-8 text-center text-xs font-bold text-slate-900">{{ item.quantity }}</span>
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100"
                        @click="increaseQuantity(item.id, item.quantity)"
                      >
                        +
                      </button>
                    </div>

                    <!-- Line Total -->
                    <span class="min-w:[80px] text-right text-base font-black text-slate-900">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Sticky Summary Panel (4 Columns) -->
          <div class="lg:col-span-4">
            <div class="sticky top-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
              <h2 class="text-lg font-black tracking-tight text-slate-900">Order Summary</h2>

              <div class="mt-6 space-y-3 text-xs font-medium text-slate-500">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span class="font-bold text-slate-900">${{ total.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span class="font-bold text-emerald-600">Free</span>
                </div>
                <div class="flex justify-between">
                  <span>Taxes</span>
                  <span class="font-bold text-slate-900">$0.00</span>
                </div>
              </div>

              <div class="my-6 h-px bg-slate-100"></div>

              <div class="flex items-baseline justify-between text-slate-900">
                <span class="text-sm font-bold">Total Amount</span>
                <span class="text-2xl font-black text-blue-600">${{ total.toFixed(2) }}</span>
              </div>

              <button
                type="button"
                class="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98]"
                @click="placeOrder"
              >
                Proceed to Checkout
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

            </div>
          </div>

        </div>
      </template>

    </div>
  </main>
</template>