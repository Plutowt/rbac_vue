<script setup lang="ts">
definePageMeta({
  permissions: ['roles:read'],
})
</script>

<template>
  <UIContentLayout :title="$t('common.menu.roles')">
    <PermissionCheckAny :pass="['roles:read']">
      <RoleTable />
    </PermissionCheckAny>
  </UIContentLayout>
</template>
