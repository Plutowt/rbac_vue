<script setup lang="ts">
definePageMeta({
  roles: ['admin'],
  breadcrumbs: () => {
    const { t } = useI18n()
    return [
      { label: t('common.itemManage', { item: t('common.user') }), to: 'users' },
    ]
  },
})
</script>

<template>
  <UIContainer>
    <ACard :bordered="false">
      <UserData />
    </ACard>
  </UIContainer>
</template>
