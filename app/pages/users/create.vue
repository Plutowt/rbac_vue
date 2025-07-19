<script setup lang="ts">
definePageMeta({
  permissions: ['users:create'],
})
</script>

<template>
  <UserCreateForm v-permission="['users:create']" />
</template>
