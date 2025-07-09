<script setup lang="ts">
definePageMeta({
  permissions: ['users:create'],
})
</script>

<template>
  <UserCreateForm v-permissions="['users:create']" />
</template>
