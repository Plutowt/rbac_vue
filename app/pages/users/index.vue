<script setup lang="ts">
definePageMeta({
  permissions: [
    'users:create',
    'users:delete',
    'users:read',
    'users:update',
    'users',
  ],
})
</script>

<template>
  <div class="size-full space-y-6 bg-arco-bg-1 p-4">
    <h3 class="text-xl font-arco-500">
      {{ $t('common.menu.users') }}
    </h3>

    <UserTable v-permissions="['users:read']" />
  </div>
</template>
