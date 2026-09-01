<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { navigateTo } from '#app'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const auth = useAuthStore()

async function submit() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  try {
    isLoading.value = true
    
    // Pass 4 separate parameters matching updated Pinia store function signature
    await auth.register(
      firstName.value,
      lastName.value,
      email.value,
      password.value
    )
    
    navigateTo('/product')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to create your account.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-50/50 py-12 px-4 sm:px-6">
    <div class="w-full max-w-xl overflow-hidden rounded-t-lg border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-12">
      
      <!-- Header Section -->
      <div class="mb-8">
        <span class="text-sm font-bold uppercase tracking-wider text-blue-600">Get Started</span>
        <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900">Create Account</h1>
        <p class="mt-3 text-base leading-relaxed text-slate-600">
          Sign up to save items to your cart, manage orders, and check out faster.
        </p>
      </div>

      <!-- Error Message Banner -->
      <div v-if="error" class="mb-6 rounded-t-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600">
        {{ error }}
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="submit">
        <!-- Name Row (2 Columns) -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">First Name</label>
            <input
              v-model.trim="firstName"
              type="text"
              required
              placeholder="John"
              class="w-full rounded-sm border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
            <input
              v-model.trim="lastName"
              type="text"
              required
              placeholder="Doe"
              class="w-full rounded-sm border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <input
            v-model.trim="email"
            type="email"
            required
            autocomplete="email"
            placeholder="Enter your email address"
            class="w-full rounded-sm border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            minlength="6"
            required
            autocomplete="new-password"
            spellcheck="false"
            autocorrect="off"
            autocapitalize="off"
            placeholder="At least 6 characters"
            class="w-full rounded-sm border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            minlength="6"
            required
            autocomplete="new-password"
            spellcheck="false"
            autocorrect="off"
            autocapitalize="off"
            placeholder="Re-enter your password"
            class="w-full rounded-sm border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base font-medium text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-sm bg-blue-600 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <!-- Login Route Link -->
        <p class="pt-2 text-center text-sm font-medium text-slate-600">
          Already have an account?
          <NuxtLink to="/login" class="font-bold text-blue-600 hover:text-blue-700">
            Sign In
          </NuxtLink>
        </p>
      </form>
    </div>
  </main>
</template>