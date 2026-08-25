<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

function submit() {
  error.value = ''
  try {
    auth.register(name.value, email.value, password.value)
    router.push('/product')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to create your account.'
  }
}
</script>

<template>
  <main class="mx-auto max-w-md p-6">
    <form class="space-y-5 rounded-xl bg-white p-8 shadow-lg" @submit.prevent="submit">
      <div><h1 class="text-3xl font-bold">Create account</h1><p class="mt-1 text-gray-600">Register before adding products to your cart.</p></div>
      <p v-if="error" class="rounded bg-red-50 p-3 text-red-600">{{ error }}</p>
      <label class="block">Name<input v-model="name" required class="mt-1 w-full rounded border p-3" /></label>
      <label class="block">Email<input v-model="email" type="email" required class="mt-1 w-full rounded border p-3" /></label>
      <label class="block">Password<input v-model="password" type="password" minlength="6" required class="mt-1 w-full rounded border p-3" /></label>
      <button class="w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">Register</button>
      <p class="text-center text-sm">Already registered? <NuxtLink to="/login" class="font-medium text-blue-600">Login</NuxtLink></p>
    </form>
  </main>
</template>
