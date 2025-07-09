<script setup lang="ts">
const props = defineProps<{ iso: ISO3166_1_Alpha_2, alt?: string }>()
const path = computed(() => `/image/flag/${props.iso}.svg`)
</script>

<template>
  <NuxtImg :src="path" :alt="$props.alt" />
</template>
