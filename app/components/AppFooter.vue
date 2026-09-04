<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

function handleSubscribe() {
  if (!email.value) return
  email.value = ''
}
</script>

<template>
  <footer class="w-full bg-[#1a4b6e] text-white font-sans text-sm">
    <!-- Top Section -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        
        <!-- Column 1: Brand Logo KHMERES -->
        <div class="flex flex-col justify-start">
          <NuxtLink to="/" class="text-3xl font-extrabold tracking-wider text-white">
            KHMERES
          </NuxtLink>
        </div>

        <!-- Column 2: SPECIAL -->
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            SPECIAL
          </h3>
          <ul class="space-y-2.5 text-xs text-slate-200">
            <li><NuxtLink to="/product" class="hover:underline">Featured Products</NuxtLink></li>
            <li><NuxtLink to="/product" class="hover:underline">Latest Products</NuxtLink></li>
            <li><NuxtLink to="/product" class="hover:underline">Best Selling Products</NuxtLink></li>
            <li><NuxtLink to="/product" class="hover:underline">Top Rated Products</NuxtLink></li>
          </ul>
        </div>

        <!-- Column 3: ACCOUNT & SHIPPING INFO -->
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            ACCOUNT & SHIPPING INFO
          </h3>
          <ul class="space-y-2.5 text-xs text-slate-200">
            <li><NuxtLink to="/about" class="hover:underline">Refund Policy</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:underline">Return Policy</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:underline">Cancellation Policy</NuxtLink></li>
          </ul>
        </div>

        <!-- Column 4: NEWSLETTER -->
        <div>
          <h3 class="mb-2 text-sm font-bold uppercase tracking-wide text-white">
            NEWSLETTER
          </h3>
          <p class="mb-4 text-xs text-slate-200">
            Subscribe to our new channel to get latest updates
          </p>
          <form class="relative flex items-center" @submit.prevent="handleSubscribe">
            <input
              v-model="email"
              type="email"
              placeholder="Your Email Address"
              class="w-full rounded-md bg-[#163b57] py-2.5 pl-3 pr-28 text-xs text-white placeholder-slate-400 border border-slate-500/30 focus:outline-none"
            />
            <button
              type="submit"
              class="absolute right-1 rounded bg-white px-4 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      <!-- Middle Contact Info Bar -->
      <div class="mt-12 border-t border-slate-400/20 pt-8">
        <div class="grid grid-cols-1 gap-6 text-xs text-white sm:grid-cols-2 md:grid-cols-4">
          
          <!-- Phone -->
          <div>
            <span class="block font-bold text-white mb-1">Start a conversation</span>
            <div class="flex items-center gap-2 text-slate-200">
              <svg class="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <a href="tel:+85517935151" class="hover:underline">+855972060975</a>
            </div>
          </div>

          <!-- Email -->
          <div class="flex items-center gap-2 text-slate-200">
            <svg class="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <a href="mailto:info@nika2u.com" class="hover:underline">info@khmeres.com</a>
          </div>

          <!-- Support Ticket -->
          <div class="flex items-center gap-2 text-slate-200">
            <svg class="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <NuxtLink to="/contact" class="hover:underline">Support ticket</NuxtLink>
          </div>

          <!-- Address -->
          <div>
            <span class="block font-bold text-white mb-1">Address</span>
            <div class="flex items-center gap-2 text-slate-200">
              <svg class="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span class="truncate">Street 222, #450 BKK3, BKK Phnom Penh</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Bottom Darker Bar -->
    <div class="bg-[#163e5c] py-4 text-xs text-slate-300">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        
        <!-- Copyright -->
        <div>
          KHMERES @ 2026
        </div>

        <!-- SVG Social Media Icons -->
        <div class="flex items-center gap-2.5">
          <!-- TikTok -->
          <a href="#" class="flex h-7 w-7 items-center justify-center rounded-full bg-[#204d6d] text-white hover:bg-blue-600 transition-colors" aria-label="TikTok">
            <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-2.88-2.89c.28 0 .56.04.83.12V9.41a6.32 6.32 0 00-.83-.05 6.34 6.34 0 106.34 6.34V9.33a8.16 8.16 0 004.76 1.51V7.39a4.85 4.85 0 01-1.01-.7z"/>
            </svg>
          </a>

          <!-- Instagram -->
          <a href="#" class="flex h-7 w-7 items-center justify-center rounded-full bg-[#204d6d] text-white hover:bg-blue-600 transition-colors" aria-label="Instagram">
            <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <!-- Facebook -->
          <a href="#" class="flex h-7 w-7 items-center justify-center rounded-full bg-[#204d6d] text-white hover:bg-blue-600 transition-colors" aria-label="Facebook">
            <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          <!-- Telegram -->
          <a href="#" class="flex h-7 w-7 items-center justify-center rounded-full bg-[#204d6d] text-white hover:bg-blue-600 transition-colors" aria-label="Telegram">
            <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.811-.168.732-.44 0.978-.7 1.002-.566.052-1-.374-1.549-.734-.859-.563-1.344-.913-2.177-1.462-.963-.635-.339-.985.21-1.556.143-.149 2.628-2.408 2.676-2.613.006-.026.012-.123-.046-.175s-.144-.035-.206-.021c-.088.02-1.488.946-4.201 2.778-.397.272-.757.406-1.08.398-.356-.008-1.041-.202-1.55-.368-.625-.203-1.122-.311-1.079-.656.022-.18.271-.365.746-.556 2.92-1.272 4.869-2.11 5.847-2.516 2.784-1.157 3.363-1.358 3.74-1.364.083-.001.268.02.388.118.101.082.13.193.143.271.013.078.029.256.016.398z"/>
            </svg>
          </a>

          <!-- YouTube -->
          <a href="#" class="flex h-7 w-7 items-center justify-center rounded-full bg-[#204d6d] text-white hover:bg-blue-600 transition-colors" aria-label="YouTube">
            <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

        <!-- Policy Links -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/about" class="hover:underline">Terms & Conditions</NuxtLink>
          <NuxtLink to="/about" class="hover:underline">Privacy policy</NuxtLink>
        </div>

      </div>
    </div>
  </footer>
</template>