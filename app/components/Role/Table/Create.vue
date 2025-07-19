<template>
  <NuxtLinkLocale to="roles-create">
    <AButton type="primary">
      <template #icon>
        <IconPlus />
      </template>
      {{ $t('common.createRole') }}
    </AButton>
  </NuxtLinkLocale>
</template>
