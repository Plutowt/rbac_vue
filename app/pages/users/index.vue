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

// const auth = useAuth()
</script>

<template>
  <div>
    <UserCreate />

    <UserList v-if="checkPermissions(['users:read'])" />
  </div>
</template>
