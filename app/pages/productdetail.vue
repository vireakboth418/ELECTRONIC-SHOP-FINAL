<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import { onMounted, ref } from "vue";
import { useProductStore } from "../stores/productApi";
import type { Product } from "../type/product";
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'


const route = useRoute();
const productId = Number(route.query.id);


const productStore = useProductStore()
const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const product = ref<Product | null>(null);

onMounted(async () => {
  auth.initialize()
  product.value = await  productStore.getProductById(productId)
});

function addToCart() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  if (product.value) cart.addProduct(product.value)
}

</script>

<template>

  <div v-if="productStore.isloading">
  <h1 class="text-3xl text-center mt-10 font-bold">
    Loading...
  </h1>
</div>

<div v-else>

  <div v-if="!product">
    <h1 class="text-3xl text-center mt-10 font-bold text-red-500">
      Product not found
    </h1>
  </div>


  <div
    v-else
    class="min-h-screen  bg-center p-6"
  >

    <div class="max-w-5xl mx-auto overflow-hidde bg-[url('')]  bg-cover shadow-lg backdrop-blur-sm">
      
      <div class="grid md:grid-cols-2 gap-8 p-8">

        <!-- Product Image -->
        <div class="flex items-center justify-center   p-5">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-[400px] object-cover  hover:scale-105 transition duration-300"
          />
        </div>


        <!-- Product Information -->
        <div class="flex flex-col justify-center">

          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            {{ product.name }}
          </h1>


          <p class="text-gray-500 text-lg leading-relaxed mb-6">
            {{ product.description }}
          </p>


          <div class="flex items-center gap-3 mb-6">
            <span class="bg-blue-100 text-blue-10 px-4 py-2 ">
              Electronics
            </span>

            <span class="bg-green-100 text-green-600 px-4 py-2 ">
              In Stock
            </span>
          </div>


          <h2 class="text-4xl font-bold text-blue-600 mb-6">
            ${{ product.price }}
          </h2>


          <div class="flex gap-4">

            <button
              class="flex-1 bg-blue-600 text-white py-3 text-lg font-semibold hover:bg-blue-700 transition"
              @click="addToCart"
            >
              Add To Cart 🛒
            </button>


            <button
              class="px-6 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              ♡
            </button>

          </div>


        </div>

      </div>

    </div>

  </div>

</div>
</template>
