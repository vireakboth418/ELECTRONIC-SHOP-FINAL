<script setup lang="ts">

const props = defineProps<{
    id:number | string,
    name:string,
    price:number,
    description:string,
    image:string
}>()

</script>

<template>
  <div class=" overflow-hidden rounded-xl bg-white shadow-lg">
    <!-- Image -->
    <RouterLink :to="'/product/' + props.id">
      <img
        :src="props.image"
        alt="Iphone"
        class="h-48 w-full object-cover"
    />

    </RouterLink>

    <!-- Content -->
    <div class="p-5">
      <h2 class="text-xl font-bold text-gray-800">{{ props.name }}</h2>

      <p class="mt-2 text-gray-600">{{ props.description }}</p>

      <div class="mt-4 flex items-center justify-between">
        <span class="text-xl font-bold text-blue-600"> ${{ props.price }} </span>

        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Buy Now
        </button>
      </div>
    </div>
  </div>
</template>
