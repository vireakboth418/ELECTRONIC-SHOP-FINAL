<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { navigateTo } from '#app'

const auth = useAuthStore()
const route = useRoute()

const sections = [
  {
    title: 'Overview',
    links: [
      { label: 'Dashboard', to: '/admin', icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'All Products', to: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { label: 'Insert Product', to: '/admin/products?action=create', icon: 'M12 5v14M5 12h14' },
    ],
  },
  {
    title: 'Management',
    links: [
      { label: 'Users', to: '/admin/users', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-7.13a4 4 0 11-8 0 4 4 0 018 0zm6 1a3 3 0 11-6 0 3 3 0 016 0z' },
      { label: 'Orders', to: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    ],
  },
  {
    title: 'Activity',
    links: [
      { label: 'Login History', to: '/admin/logins', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-8-5V3m6 4a9 9 0 11-8-8.9' },
    ],
  },
]

function isActive(link: { to: string }) {
  return link.to.includes('?') ? route.fullPath === link.to : route.path === link.to
}

function goBack() {
  navigateTo('/')
}

function logout() {
  auth.logout()
  navigateTo('/')
}
</script>

<template>
  <aside class="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-600">
    <!-- Brand -->
    <div class="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-black text-white">
        A
      </div>
      <div>
        <p class="text-sm font-bold text-slate-900">Admin Panel</p>
        <p class="text-[11px] font-medium text-slate-400">Electronic Store</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4 pt-5">
      <div v-for="section in sections" :key="section.title">
        <p class="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {{ section.title }}
        </p>
        <div class="flex flex-col gap-0.5">
          <NuxtLink
            v-for="link in section.links"
            :key="link.to"
            :to="link.to"
            class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors"
            :class="isActive(link)
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              :class="isActive(link) ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'"
            >
              <path :d="link.icon" />
            </svg>
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="border-t border-slate-100 p-4">
      <div class="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-600 text-xs font-bold uppercase text-white">
          {{ auth.user?.name?.[0] || 'A' }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-xs font-bold text-slate-900">{{ auth.user?.name || 'Admin' }}</p>
          <p class="truncate text-[11px] text-slate-400">{{ auth.user?.email }}</p>
        </div>
      </div>

      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        @click="goBack"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
        </svg>
        Back to Store
      </button>

      <button
        type="button"
        class="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        @click="logout"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        Logout
      </button>
    </div>
  </aside>
</template>