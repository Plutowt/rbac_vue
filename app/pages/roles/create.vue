<script setup lang="ts">
definePageMeta({
  permissions: ['roles:create'],
})
</script>

<template>
  <RoleCreateForm v-permission="['roles:create']" />
</template>
