<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const orderPlaced = ref(false)
const total = computed(() => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0))

onMounted(() => {
  auth.initialize()
  if (!auth.isAuthenticated) router.replace({ path: '/login', query: { redirect: '/cart' } })
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

function increaseQuantity(id: string | number, quantity: number) {
  cart.updateQuantity(id, quantity + 1)
}

function decreaseQuantity(id: string | number, quantity: number) {
  cart.updateQuantity(id, quantity - 1)
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 py-10">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <div v-if="orderPlaced" class="rounded-2xl bg-green-50 p-10 text-center shadow-sm">
      <h1 class="text-3xl font-bold text-green-700">Order placed!</h1>
      <p class="mt-3 text-gray-700">Thanks for your purchase, {{ auth.user?.name }}. We will send your order details by email.</p>
      <NuxtLink to="/product" class="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Continue shopping</NuxtLink>
    </div>

    <template v-else>
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wider text-blue-600">Shopping bag</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-900">Your cart</h1>
          <p class="mt-1 text-gray-600">Review your items and complete your purchase.</p>
        </div>
        <span class="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">{{ cart.itemCount }} items</span>
      </div>

      <div v-if="!cart.items.length" class="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">
        <p class="text-lg text-gray-600">Your cart is empty.</p>
        <NuxtLink to="/product" class="mt-4 inline-block font-medium text-blue-600">Browse products</NuxtLink>
      </div>

      <div v-else class="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <article v-for="item in cart.items" :key="item.id" class="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-5 sm:p-5">
            <img :src="item.image" :alt="item.name" class="h-[88px] w-[88px] rounded-xl object-cover sm:h-28 sm:w-28" />
            <div class="min-w-0">
              <h2 class="truncate text-lg font-bold text-slate-900">{{ item.name }}</h2>
              <p class="mt-1 text-sm text-slate-500">${{ item.price.toFixed(2) }} each</p>
              <div class="mt-4 flex items-center justify-between gap-3 sm:justify-start">
                <div class="flex items-center rounded-lg border border-slate-200">
                  <button class="h-9 w-9 text-lg text-slate-600 hover:bg-slate-100" aria-label="Decrease quantity" @click="decreaseQuantity(item.id, item.quantity)">−</button>
                  <span class="w-8 text-center text-sm font-semibold">{{ item.quantity }}</span>
                  <button class="h-9 w-9 text-lg text-slate-600 hover:bg-slate-100" aria-label="Increase quantity" @click="increaseQuantity(item.id, item.quantity)">+</button>
                </div>
                <button class="text-sm font-medium text-red-600 hover:text-red-700" @click="cart.updateQuantity(item.id, 0)">Remove</button>
              </div>
            </div>
            <strong class="col-start-2 text-right text-lg text-slate-900 sm:col-start-3 sm:row-start-1">${{ (item.price * item.quantity).toFixed(2) }}</strong>
          </article>
        </section>

        <aside class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-6">
          <h2 class="text-xl font-bold text-slate-900">Order summary</h2>
          <div class="mt-5 space-y-3 text-sm text-slate-600">
            <div class="flex justify-between"><span>Items ({{ cart.itemCount }})</span><span>${{ total.toFixed(2) }}</span></div>
            <div class="flex justify-between"><span>Shipping</span><span class="font-medium text-green-600">Free</span></div>
          </div>
          <div class="my-5 flex justify-between border-t border-slate-200 pt-5"><span class="font-bold text-slate-900">Total</span><strong class="text-2xl text-blue-600">${{ total.toFixed(2) }}</strong></div>
          <button class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm hover:bg-blue-700" @click="placeOrder">Place order</button>
          <p class="mt-3 text-center text-xs text-gray-500">Demo checkout — no payment will be taken.</p>
        </aside>
      </div>
    </template>
    </div>
  </main>
</template>
