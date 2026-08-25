<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

function submit() {
  error.value = ''
  try {
    auth.login(email.value, password.value)
    router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/product')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to log in.'
  }
}
</script>

<template>
  <main class="mx-auto max-w-md p-6">
    <form class="space-y-5 rounded-xl bg-white p-8 shadow-lg" @submit.prevent="submit">
      <div><h1 class="text-3xl font-bold">Welcome back</h1><p class="mt-1 text-gray-600">Log in to add products to your cart.</p></div>
      <p v-if="error" class="rounded bg-red-50 p-3 text-red-600">{{ error }}</p>
      <label class="block">Email<input v-model="email" type="email" required class="mt-1 w-full rounded border p-3" /></label>
      <label class="block">Password<input v-model="password" type="password" required class="mt-1 w-full rounded border p-3" /></label>
      <button class="w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">Login</button>
      <p class="text-center text-sm">No account? <NuxtLink to="/register" class="font-medium text-blue-600">Register</NuxtLink></p>
    </form>
  </main>
</template>
