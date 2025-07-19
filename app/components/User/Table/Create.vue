<template>
  <NuxtLinkLocale to="users-create">
    <AButton type="primary">
      <template #icon>
        <IconPlus />
      </template>
      {{ $t('common.createUser') }}
    </AButton>
  </NuxtLinkLocale>
</template>
