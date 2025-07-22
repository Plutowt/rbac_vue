<script setup lang="ts">
definePageMeta({
  anyPermissions: ['roles:create'],
})
</script>

<template>
  <UIContentLayout :title="$t('common.createRole')">
    <PermissionCheckAny :pass="['roles:create']">
      <RoleCreateForm />
    </PermissionCheckAny>
  </UIContentLayout>
</template>
