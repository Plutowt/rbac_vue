<script setup lang="ts">
import type { PermissionCode } from '~/api/v1_1'

defineProps<{ pass: PermissionCode[] }>()
</script>

<template>
  <slot v-if="$props.pass && useHasAllPermissions(...$props.pass)" />
</template>
