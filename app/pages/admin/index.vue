<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '~/stores/admin'
import { navigateTo } from '#app'


const admin = useAdminStore()

onMounted(() => {
  admin.loadDashboard()
})

const stats = [
  { label: 'Total Products', value: () => admin.totalProducts, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'bg-blue-600' },
  { label: 'Total Users', value: () => admin.totalUsers, icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-7.13a4 4 0 11-8 0 4 4 0 018 0zm6 1a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-emerald-600' },
  { label: 'Total Orders', value: () => admin.totalOrders, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-amber-600' },
  { label: 'Total Revenue', value: () => `$${admin.totalRevenue.toLocaleString()}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-rose-600' },
  { label: 'Total Logins', value: () => admin.totalLogins, icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-8-5V3m6 4a9 9 0 11-8-8.9', color: 'bg-violet-600' },
]
</script>

<template>
  <div class="space-y-8 px-0 sm:px-6 ">
    <div>
      <h2 class="text-2xl mt-10 font-bold text-slate-900">Overview</h2>
      <p class="mt-1 text-sm text-slate-500">Welcome back! Here's what's happening in your store.</p>
    </div>

    <div v-if="admin.isLoading" class="py-16 text-center text-sm font-semibold text-slate-500">
      Loading dashboard...
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div :class="[stat.color, 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white']">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path :d="stat.icon" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ stat.label }}</p>
            <p class="text-2xl font-black text-slate-900">{{ stat.value() }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6  lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-900">Recent Orders</h3>
            <button
              type="button"
              class="text-xs font-bold text-blue-600 hover:text-blue-700"
              @click="navigateTo('/admin/orders')"
            >
              View all
            </button>
          </div>
          <div v-if="admin.orders.length === 0" class="py-8 text-center text-sm text-slate-400">
            No orders yet.
          </div>
          <ul v-else class="divide-y divide-slate-100">
            <li
              v-for="order in admin.orders.slice(0, 5)"
              :key="order.id"
              class="flex items-center justify-between py-3"
            >
              <div>
                <p class="text-sm font-semibold text-slate-800">Order #{{ order.id }}</p>
                <p class="text-xs text-slate-500">{{ admin.getUserName(order.userId) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-slate-900">${{ order.total.toLocaleString() }}</p>
                <span
                  class="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  :class="order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
                >
                  {{ order.status }}
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-900">Low Stock Products</h3>
            <button
              type="button"
              class="text-xs font-bold text-blue-600 hover:text-blue-700"
              @click="navigateTo('/admin/products')"
            >
              PRODUCT MANAGEMENT
            </button>
          </div>
          <div v-if="admin.lowStockCount === 0" class="py-8 text-center text-sm text-slate-400">
            All products are well stocked.
          </div>
          <ul v-else class="divide-y divide-slate-100">
            <li
              v-for="product in admin.products.filter((p) => Number(p.stock) <= 5).slice(0, 5)"
              :key="product.id"
              class="flex items-center gap-3 py-3"
            >
              <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-lg border border-slate-200 object-cover" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-800">{{ product.name }}</p>
                <p class="text-xs text-slate-500">{{ product.category }}</p>
              </div>
              <span class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-600">
                {{ product.stock }} left
              </span>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-900">Recent Logins</h3>
            <button
              type="button"
              class="text-xs font-bold text-blue-600 hover:text-blue-700"
              @click="navigateTo('/admin/logins')"
            >
              View all
            </button>
          </div>
          <div v-if="admin.loginLog.length === 0" class="py-8 text-center text-sm text-slate-400">
            No login activity yet.
          </div>
          <ul v-else class="divide-y divide-slate-100">
            <li
              v-for="record in [...admin.loginLog].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)"
              :key="record.id"
              class="flex items-center gap-3 py-3"
            >
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white uppercase"
                :class="record.method === 'register' ? 'bg-amber-500' : 'bg-blue-600'"
              >
                {{ record.name?.[0] || 'U' }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-800">{{ record.name }}</p>
                <p class="text-xs text-slate-500">{{ new Date(record.time).toLocaleString() }}</p>
              </div>
              <span
                class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
                :class="record.method === 'register' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
              >
                {{ record.method }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
