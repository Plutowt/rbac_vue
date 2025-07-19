<script setup lang="ts">
definePageMeta({ permissions: ['users:read'] })
</script>

<template>
  <UIContentLayout :title="$t('common.menu.users')">
    <PermissionCheckAny :pass="['users:read']">
      <UserTable />
    </PermissionCheckAny>
  </UIContentLayout>
</template>
