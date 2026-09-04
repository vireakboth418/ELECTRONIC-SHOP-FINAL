<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productApi'

const productStore = useProductStore()
const featuredProducts = computed(() => (productStore.productList ?? []).slice(0, 4))
const saleProduct = computed(()=>(productStore.productList ?? []).filter((pro)=>pro.tag == "Best Seller"))
const populars = computed(()=>{
  return (productStore.productList ?? []).filter(pro=> pro.tag == "Popular").slice(0,4)
})

const slides = ref<string[]>([])
const currentSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

function nextSlide() {
  if (slides.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

function prevSlide() {
  if (slides.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

function goToSlide(index: number) {
  currentSlide.value = index
}

function startAutoSlide() {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000)
}

onMounted(async() =>{ 
 await productStore.getAllProducts()
 slides.value = [
   'image.png',
   'https://images.unsplash.com/photo-1498042666497-a2f71db5901c?auto=format&fit=crop&w=2100&q=80',
   'https://images.unsplash.com/photo-1483983071284-ae3d64744d4f?auto=format&fit=crop&w=2100&q=80',
   'https://images.unsplash.com/photo-1593652861622-81a6ad408fa8?auto=format&fit=crop&w=2100&q=80',
   'https://images.unsplash.com/photo-1572122682935-0d0f5b8d9f1a?auto=format&fit=crop&w=2100&q=80'
 ]
 startAutoSlide()
})

onBeforeUnmount(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <section class="relative isolate h-[600px] w-full overflow-hidden">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="{ 'opacity-100 z-0': currentSlide === index, 'opacity-0 z-0': currentSlide !== index }"
        :style="{ backgroundImage: `url('${slide}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"
      ></div>

      <div
        v-for="(slide, index) in slides"
        :key="'overlay-' + index"
        class="absolute inset-0 -z-10 bg-slate-950/70 transition-opacity duration-1000 ease-in-out"
        :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
      ></div>

      <div class="absolute inset-0 -z-10 bg-slate-950/70"></div>

      <div class="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div class="max-w-2xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">New technology, made simple</p>
          <h1 class="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">Find tech you'll love.</h1>
          <p class="mt-6 max-w-xl text-lg leading-8 text-slate-200">Discover powerful phones, laptops, audio gear, gaming devices, and more—picked for everyday life.</p>
          <div class="mt-9 flex flex-wrap gap-4">
            <NuxtLink to="/product" class="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500">Shop all products</NuxtLink>
            <NuxtLink to="/register" class="rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/20">Create account</NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="slides.length > 1" class="absolute bottom-6 z-20 flex w-full justify-center gap-2">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          @mouseenter="() => { if (slideInterval) clearInterval(slideInterval) }"
          @mouseleave="startAutoSlide"
          class="h-2 w-2 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'bg-blue-500 w-8' : 'bg-white/30 hover:bg-white/50'"
        ></button>
      </div>

      <button
        v-if="slides.length > 1"
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button
        v-if="slides.length > 1"
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wider text-blue-600">Popular picks</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-900">Featured products</h2>
        </div>
        <NuxtLink to="/product" class="font-semibold text-blue-600 hover:text-blue-700">View all products →</NuxtLink>
      </div>

      <div v-if="productStore.isGetProductsLoading" class="py-12 text-center text-slate-600">Loading products...</div>
      <div v-else class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in featuredProducts" :key="product.id" v-bind="product" />
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wider text-blue-600">Popular picks</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-900">Best Saller</h2>
        </div>
        <NuxtLink to="/product" class="font-semibold text-blue-600 hover:text-blue-700">View all products →</NuxtLink>
      </div>

      <div v-if="productStore.isGetProductsLoading" class="py-12 text-center text-slate-600">Loading products...</div>
      <div v-else class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in saleProduct" :key="product.id" v-bind="product" />
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wider text-blue-600">Popular picks</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-900">Popular</h2>
        </div>
        <NuxtLink to="/product" class="font-semibold text-blue-600 hover:text-blue-700">View all products →</NuxtLink>
      </div>

      <div v-if="productStore.isGetProductsLoading" class="py-12 text-center text-slate-600">Loading products...</div>
      <div v-else class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in populars" :key="product.id" v-bind="product" />
      </div>
    </section>

  </main>
</template>
