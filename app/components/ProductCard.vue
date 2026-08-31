<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  id: number | string
  name: string
  price: number
  description: string
  image: string
  category?: string
  inStock?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  category: 'Electronics',
  inStock: true
})

const emit = defineEmits<{
  (e: 'add-to-cart', id: number | string): void
}>()

const imageError = ref(false)

function handleImageError() {
  imageError.value = true
}

function handleAddToCart(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  emit('add-to-cart', props.id)
}
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10">
    
    <!-- Image Display & Top Badges -->
    <NuxtLink :to="`/productdetail?id=${props.id}`" class="relative block aspect-square w-full overflow-hidden bg-slate-50">
      <img
        v-if="!imageError"
        :src="props.image"
        :alt="props.name"
        loading="lazy"
        class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
        @error="handleImageError"
      />
      
      <!-- Fallback Image -->
      <div v-else class="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Category & Stock Status Badges -->
      <div class="absolute inset-x-3 top-3 flex items-center justify-between pointer-events-none">
        <span class="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1 text-[10px] font-semibold text-white shadow-xs backdrop-blur-md">
          {{ props.category }}
        </span>

        <span 
          class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur-md"
          :class="props.inStock ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="props.inStock ? 'bg-emerald-500' : 'bg-amber-500'"></span>
          {{ props.inStock ? 'In Stock' : 'Low Stock' }}
        </span>
      </div>
    </NuxtLink>

    <!-- Content Area -->
    <div class="flex flex-1 flex-col justify-between p-5">
      <div>
        <!-- Title -->
        <NuxtLink :to="`/productdetail?id=${props.id}`" class="block">
          <h3 class="line-clamp-1 text-base font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
            {{ props.name }}
          </h3>
        </NuxtLink>

        <!-- Description -->
        <p class="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {{ props.description }}
        </p>
      </div>

      <!-- Pricing & Actions -->
      <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div class="flex flex-col">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Price</span>
          <span class="text-xl font-black text-slate-900">
            ${{ props.price.toLocaleString() }}
          </span>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
          @click="handleAddToCart"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>