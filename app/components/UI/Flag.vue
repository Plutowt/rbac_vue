<script setup lang="ts">
const props = defineProps<{ iso: ISO3166_1_Alpha_2 }>()
const path = computed(() => `/image/flag/${props.iso}.svg`)
</script>

<template>
  <NuxtImg :src="path" />
</template>
