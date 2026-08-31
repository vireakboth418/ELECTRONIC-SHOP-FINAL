<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from 'vue-router'
import ProductCard from "../components/ProductCard.vue";
import { useCounterStore } from "../stores/counter.ts";
import { useProductStore } from "../stores/productApi.ts";
import Laptop from "../components/Laptop.vue";

const { count } = useCounterStore();
const route = useRoute()

const productStore = useProductStore()
const searchTerm = computed(() => typeof route.query.search === 'string' ? route.query.search.trim().toLowerCase() : '')
const filteredProducts = computed(() => (productStore.productList ?? []).filter((product) =>
  product.name.toLowerCase().includes(searchTerm.value),
))
const smartphones = computed(() => (productStore.productList ?? []).filter((product) =>
  product.category === 'Smartphone'
))
onMounted(() => {
  productStore.getAllProducts()
});


</script>

<template>
  <h1 class="text-2xl  pl-30  font-bold py-10">
    
    {{ searchTerm ? `Search results for: ${searchTerm}` : 'Smart Phone' }} {{  }}
  </h1>

  <p v-if="searchTerm && !productStore.isGetProductsLoading" class="px-4 text-gray-600">
    {{ filteredProducts.length }} product{{ filteredProducts.length === 1 ? '' : 's' }} found
  </p>

  <div
    class="grid grid-cols-1 md:grid-cols-3 md:m-10 lg:grid-cols-4 lg:m-15 gap-4 justify-center"
  >
    <ProductCard
      v-for="e in filteredProducts"
      :key="e.id"
      :id="e.id"
      :name="e.name"
      :price="e.price"
      :description="e.description"
      :image="e.image"
    />
  </div>
  

  <h1 class="text-2xl  pl-30  font-bold py-10">
    
    {{ searchTerm ? `Search results for: ${searchTerm}` : 'Smart Phone' }} {{  }}
  </h1>
  <div
    class="grid grid-cols-1 md:grid-cols-3 md:m-10 lg:grid-cols-4 lg:m-15 gap-4 justify-center"
  >
    <ProductCard
      v-for="e in smartphones"
      :key="e.id"
      :id="e.id"
      :name="e.name"
      :price="e.price"
      :description="e.description"
      :image="e.image"
    />
  </div>

  <p v-if="searchTerm && !productStore.isGetProductsLoading && !filteredProducts.length" class="px-4 text-gray-600">
    No products match “{{ searchTerm }}”.
  </p>
 
</template>
