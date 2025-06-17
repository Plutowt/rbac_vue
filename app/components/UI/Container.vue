<script setup lang="ts">
const props = defineProps<{
  breadcrumbs?: Array<NuxtLinkLocaleProps & { label: string }>
}>()
const breadcrumbs = computed(() => props?.breadcrumbs || useRoute().meta.breadcrumbs?.())
</script>

<template>
  <div class="flex h-full flex-col gap-4">
    <div class="flex items-center">
      <slot name="breadcrumbs">
        <LayoutBreadcrumb :breadcrumbs="breadcrumbs" />
      </slot>

      <div class="ml-auto">
        <slot name="right" />
      </div>
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
