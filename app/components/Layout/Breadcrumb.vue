<script setup lang="ts">
defineProps<{ breadcrumbs?: (NuxtLinkLocaleProps & { label: string })[] }>()
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-if="$props.breadcrumbs?.length">
      <NuxtLinkLocale to="index">
        <IconHome />
      </NuxtLinkLocale>
    </a-breadcrumb-item>

    <a-breadcrumb-item v-for="(i, index) in $props.breadcrumbs" :key="index">
      <NuxtLinkLocale v-bind="i">
        {{ i.label }}
      </NuxtLinkLocale>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
