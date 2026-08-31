<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { navigateTo } from '#app'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const isLoading = ref(false)

const auth = useAuthStore()
const route = useRoute()

// State for Forgot Password Modal
const isForgotModalOpen = ref(false)
const resetEmail = ref('')
const resetMessage = ref('')
const isResetLoading = ref(false)

async function submit() {
  error.value = ''
  try {
    isLoading.value = true
    await auth.login(email.value, password.value)
    navigateTo(typeof route.query.redirect === 'string' ? route.query.redirect : '/product')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to log in.'
  } finally {
    isLoading.value = false
  }
}

function openForgotPassword() {
  resetEmail.value = email.value
  resetMessage.value = ''
  isForgotModalOpen.value = true
}

async function handleResetPassword() {
  if (!resetEmail.value) return
  isResetLoading.value = true
  resetMessage.value = ''
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    resetMessage.value = 'Password reset instructions have been sent to your email.'
  } catch (err) {
    resetMessage.value = 'Failed to request password reset. Please try again.'
  } finally {
    isResetLoading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6">
    <!-- Main Card Container -->
    <div class="w-full max-w-[540px] rounded-[32px] border border-slate-100 bg-white p-8 sm:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
      
      <!-- Header Section -->
      <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-wider text-[#2563EB]">WELCOME BACK</span>
        <h1 class="mt-2 text-4xl font-black tracking-tight text-[#0F172A]">Sign In</h1>
        <p class="mt-3 text-base leading-relaxed text-[#64748B]">
          Log in to your account to save items to your cart, manage orders, and check out faster.
        </p>
      </div>

      <!-- Error Message Banner -->
      <div v-if="error" class="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600">
        {{ error }}
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="submit">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-xs font-bold text-[#1E293B] mb-2">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="Enter your email address"
            class="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC]/60 px-4 py-3.5 text-base font-medium text-[#0F172A] placeholder-slate-400 transition-all focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <!-- Password Field with Modernized Eye Toggle Icon -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="password" class="block text-xs font-bold text-[#1E293B]">Password</label>
            <button
              type="button"
              class="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors"
              @click="openForgotPassword"
            >
              Forgot Password?
            </button>
          </div>
          
          <div class="relative flex items-center">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="Enter your password"
              class="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC]/60 pl-4 pr-14 py-3.5 text-base font-medium text-[#0F172A] placeholder-slate-400 transition-all focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
            
            <!-- High-Quality Eye Toggle Button -->
            <button
              type="button"
              class="absolute right-3 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-100 hover:text-[#2563EB] active:scale-95 focus:outline-none"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <!-- Eye Open Icon -->
              <svg 
                v-if="!showPassword" 
                class="h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.75" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>

              <!-- Eye Off / Slash Icon -->
              <svg 
                v-else 
                class="h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.75" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-2xl bg-[#1D61FF] py-4 text-base font-bold text-white shadow-[0_8px_20px_-6px_rgba(29,97,255,0.5)] transition-all hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>

        <!-- Register Link -->
        <p class="pt-2 text-center text-xs font-semibold text-[#64748B]">
          Don't have an account?
          <NuxtLink to="/register" class="font-bold text-[#2563EB] hover:text-blue-700">
            Create Account
          </NuxtLink>
        </p>
      </form>
    </div>

    <!-- Forgot Password Modal Popup -->
    <div 
      v-if="isForgotModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
    >
      <div class="w-full max-w-md overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 shadow-2xl">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xl font-bold text-[#0F172A]">Reset Password</h3>
          <button 
            type="button" 
            class="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" 
            @click="isForgotModalOpen = false"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="text-xs font-medium text-[#64748B] mb-5 leading-relaxed">
          Enter your email address below and we'll send you instructions to reset your password.
        </p>

        <!-- Feedback Message -->
        <p v-if="resetMessage" class="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs font-semibold text-[#2563EB]">
          {{ resetMessage }}
        </p>

        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <div>
            <label for="reset-email" class="block text-xs font-bold text-[#1E293B] mb-1.5">Email Address</label>
            <input 
              id="reset-email" 
              v-model="resetEmail" 
              type="email" 
              required 
              placeholder="Enter your email address"
              class="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC]/60 px-4 py-3.5 text-base font-medium text-[#0F172A] outline-none transition-colors focus:border-[#2563EB] focus:bg-white" 
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button 
              type="button" 
              class="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              @click="isForgotModalOpen = false"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isResetLoading"
              class="rounded-xl bg-[#1D61FF] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-600 disabled:opacity-50"
            >
              {{ isResetLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>