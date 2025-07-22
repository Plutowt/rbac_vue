<script setup lang="ts">
definePageMeta({
  anyPermissions: ['roles:read', 'roles:create'],
})
</script>

<template>
  <UIContentLayout :title="$t('common.menu.roles')">
    <PermissionCheckAny :pass="['roles:read', 'roles:create']">
      <RoleTable />
    </PermissionCheckAny>
  </UIContentLayout>
</template>
