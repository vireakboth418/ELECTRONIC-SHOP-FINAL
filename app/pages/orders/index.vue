<script setup lang="js">

</script>
<template>
    
    <div>
        <NuxtLink v-for="o in orders" :key="o.id" :to="'/orders/'+o.id"><p>{{ o.name  }}</p></NuxtLink>
    </div>

</template>