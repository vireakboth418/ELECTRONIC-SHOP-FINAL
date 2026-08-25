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
  <NuxtLink
    :to="`/productdetail?id=${props.id}`"
    class="block overflow-hidden  bg-white shadow-lg transition-shadow hover:shadow-xl"
  >
      <img
        :src="props.image"
        :alt="props.name"
        class="h-48 w-full object-cover"
      />

    <div class="p-5">
      <h2 class="text-xl font-bold text-gray-800">{{ props.name }}</h2>

      <p class="mt-2 text-gray-600">{{ props.description }}</p>

      <div class="mt-4 flex items-center justify-between">
        <span class="text-xl font-bold text-blue-600"> ${{ props.price }} </span>

        <span
          class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Buy
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
