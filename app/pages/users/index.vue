<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  permissions: [
    'users:create',
    'users:delete',
    'users:read',
    'users:update',
  ],
})
</script>

<template>
  <div><UserList /></div>
</template>
