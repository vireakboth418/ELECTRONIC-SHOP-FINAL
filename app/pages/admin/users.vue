<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '~/stores/admin'



const admin = useAdminStore()
const searchQuery = ref('')

onMounted(async () => {
  await admin.fetchUsers()
  await admin.fetchLoginLog()
})

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return admin.users ?? []
  return (admin.users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  )
})

function formatTime(iso: string) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <div class="space-y-6 px-0 sm:px-6 ">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Users</h2>
      <p class="mt-1 text-sm text-slate-500">All registered accounts ({{ admin.users.length }} total).</p>
    </div>

    <input
      v-model="searchQuery"
      type="search"
      placeholder="Search by name or email..."
      class="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
    />

    <div v-if="admin.isLoading" class="py-16 text-center text-sm font-semibold text-slate-500">
      Loading users...
    </div>

    <div
      v-else-if="admin.users.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500"
    >
      No users registered yet.
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-3.5">User</th>
              <th class="px-5 py-3.5">Email</th>
              <th class="px-5 py-3.5">Full Name</th>
              <th class="px-5 py-3.5">Role</th>
              <th class="px-5 py-3.5">Last Login</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/60">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-full font-bold text-white uppercase"
                    :class="user.role === 'admin' ? 'bg-blue-600' : 'bg-slate-400'"
                  >
                    {{ user.name?.[0] || 'U' }}
                  </div>
                  <span class="font-semibold text-slate-800">{{ user.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-slate-600">{{ user.email }}</td>
              <td class="px-5 py-3 text-slate-600">
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td class="px-5 py-3">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold uppercase"
                  :class="user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'"
                >
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td class="px-5 py-3 text-slate-600">
                <span :class="admin.lastLoginTime(user.id) ? '' : 'text-slate-400 italic'">
                  {{ formatTime(admin.lastLoginTime(user.id)) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="filteredUsers.length === 0" class="border-t border-slate-100 px-5 py-8 text-center text-sm text-slate-400">
        No users match your search.
      </p>
    </div>
  </div>
</template>
