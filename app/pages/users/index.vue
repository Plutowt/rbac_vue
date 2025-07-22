<script setup lang="ts">
definePageMeta({
  anyPermissions: ['users:read', 'users:create'],
})
</script>

<template>
  <UIContentLayout :title="$t('common.menu.users')">
    <PermissionCheckAny :pass="['users:read', 'users:create']">
      <UserTable />
    </PermissionCheckAny>
  </UIContentLayout>
</template>
