<script setup lang="ts">
defineProps<{ data?: any }>()
</script>

<template>
  <!-- <UIDevPreview :data="$props.data" /> -->
  {{ data?.user?.nickname ? `${data.user?.nickname}(${data.user?.username})` : data?.user?.username }}
</template>
