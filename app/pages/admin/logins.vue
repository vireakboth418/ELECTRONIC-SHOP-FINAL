<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
  adminTitle: 'Login History',
})

const admin = useAdminStore()
const searchQuery = ref('')
const typeFilter = ref('')

onMounted(() => {
  admin.fetchLoginLog()
})

const filteredLogs = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return (admin.loginLog ?? []).filter((r) => {
    const matchesSearch =
      !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    const matchesType = !typeFilter.value || r.method === typeFilter.value
    return matchesSearch && matchesType
  })
})

function formatTime(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Login History</h2>
      <p class="mt-1 text-sm text-slate-500">
        See who has logged in or registered ({{ admin.loginLog.length }} events).
      </p>
    </div>

    <div class="flex flex-wrap gap-3">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search by name or email..."
        class="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
      />
      <select
        v-model="typeFilter"
        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400"
      >
        <option value="">All events</option>
        <option value="login">Login</option>
        <option value="register">Register</option>
      </select>
    </div>

    <div v-if="admin.isLoading" class="py-16 text-center text-sm font-semibold text-slate-500">
      Loading login history...
    </div>

    <div
      v-else-if="admin.loginLog.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500"
    >
      No login activity yet.
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-3.5">User</th>
              <th class="px-5 py-3.5">Email</th>
              <th class="px-5 py-3.5">Event</th>
              <th class="px-5 py-3.5">Date &amp; Time</th>
              <th class="px-5 py-3.5">Device</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="record in filteredLogs" :key="record.id" class="hover:bg-slate-50/60">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white uppercase"
                    :class="record.method === 'register' ? 'bg-amber-500' : 'bg-blue-600'"
                  >
                    {{ record.name?.[0] || 'U' }}
                  </div>
                  <span class="font-semibold text-slate-800">{{ record.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-slate-600">{{ record.email }}</td>
              <td class="px-5 py-3">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold uppercase"
                  :class="record.method === 'register' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
                >
                  {{ record.method }}
                </span>
              </td>
              <td class="px-5 py-3 text-slate-600">{{ formatTime(record.time) }}</td>
              <td class="max-w-[200px] truncate px-5 py-3 text-xs text-slate-500">
                {{ record.userAgent || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="filteredLogs.length === 0" class="border-t border-slate-100 px-5 py-8 text-center text-sm text-slate-400">
        No events match your filters.
      </p>
    </div>
  </div>
</template>