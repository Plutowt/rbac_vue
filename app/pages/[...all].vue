<script lang="ts" setup>
definePageMeta({ layout: false })
</script>

<template>
  <div>
    <h2>
      Page Not Found
    </h2>

    <div>
      <AButton @click="$router.back()">
        <template #icon>
          <IconArrowLeft />
        </template>
        {{ $t('common.back') }}
      </AButton>

      <NuxtLinkLocale to="index">
        <AButton type="primary">
          <template #icon>
            <IconHome />
          </template>
          {{ $t('common.goHome') }}
        </AButton>
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<!-- <style lang="postcss" scoped>
.c-div {
  @apply space-y-8 p-4;

  h2 {
    @apply text-6xl;
  }

  .c-options {
    @apply flex gap-5;
  }
}
</style> -->
