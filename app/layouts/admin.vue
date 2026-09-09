<script setup lang="ts">
import AdminSidebar from '../components/admin/Sidebar.vue'

const route = useRoute()
</script>

<template>
  <div class="flex min-h-screen bg-slate-100">
    <AdminSidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="sticky top-0 z-30 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-bold text-slate-900">
            {{ route.meta.adminTitle || 'Admin' }}
          </h1>
          <NuxtLink
            to="/"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" /></svg>
            View Store
          </NuxtLink>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
