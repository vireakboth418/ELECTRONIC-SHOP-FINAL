<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '~/stores/admin'

const admin = useAdminStore()
const statusFilter = ref('')

onMounted(() => {
  admin.loadDashboard()
})

const statuses = ['All', 'Pending', 'Completed', 'Shipped', 'Cancelled']

const filteredOrders = computed(() => {
  if (!statusFilter.value || statusFilter.value === 'All') return admin.orders ?? []
  return (admin.orders ?? []).filter((o) => o.status === statusFilter.value)
})

function productOf(orderItem: any) {
  return (admin.products ?? []).find((p) => String(p.id) === String(orderItem.productId))
}
</script>

<template>
  <div class="space-y-6 px-0 sm:px-6 ">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Orders</h2>
      <p class="mt-1 text-sm text-slate-500">{{ admin.orders.length }} total orders.</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="status in statuses"
        :key="status"
        type="button"
        class="rounded-lg px-4 py-2 text-xs font-bold transition-colors"
        :class="statusFilter === status || (status === 'All' && statusFilter === '') ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
        @click="statusFilter = status === 'All' ? '' : status"
      >
        {{ status }}
      </button>
    </div>

    <div v-if="admin.isLoading" class="py-16 text-center text-sm font-semibold text-slate-500">
      Loading orders...
    </div>

    <div
      v-else-if="admin.orders.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500"
    >
      No orders yet.
    </div>

    <div v-else class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p class="font-bold text-slate-900">Order #{{ order.id }}</p>
            <p class="text-xs text-slate-500">Customer: {{ admin.getUserName(order.userId) }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-black text-slate-900">${{ order.total.toLocaleString() }}</p>
            <span
              class="mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
              :class="order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
            >
              {{ order.status }}
            </span>
          </div>
        </div>

        <ul class="divide-y divide-slate-50">
          <li
            v-for="(item, index) in order.products"
            :key="index"
            class="flex items-center gap-3 py-3"
          >
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600"
            >
              x{{ item.quantity }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-800">
                {{ productOf(item)?.name || `Product #${item.productId}` }}
              </p>
              <p class="text-xs text-slate-500">
                {{ productOf(item)?.category || 'Unknown category' }}
              </p>
            </div>
            <span class="text-sm font-semibold text-slate-700">
              ${{ ((productOf(item)?.finalPrice ?? 0) * item.quantity).toLocaleString() }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <p v-if="filteredOrders.length === 0 && admin.orders.length > 0" class="rounded-2xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-400">
      No orders with the selected status.
    </p>
  </div>
</template>
