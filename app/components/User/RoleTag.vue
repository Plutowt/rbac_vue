<script setup lang="ts">
import type { UserRole } from '~/api/v1/users'

const props = defineProps<{ role: UserRole }>()
const color = computed(() => {
  switch (props.role) {
    case 'admin':
      return 'arcoblue'
    case 'agent':
      return 'gold'
    case 'user':
      return 'gray'
    default:
      return 'red'
  }
})
</script>

<template>
  <ATag :color="color">
    {{ $t(`common.roles.${$props.role}`) }}
  </ATag>
</template>
