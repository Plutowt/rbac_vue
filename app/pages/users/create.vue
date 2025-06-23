<script setup lang="ts">
definePageMeta({
  permissions: ['users:create'],
  layout: 'dashboard',
})
</script>

<template>
  <UserCreateForm />
</template>
