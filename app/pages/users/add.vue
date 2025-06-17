<script setup lang="ts">
definePageMeta({
  roles: ['admin'],
  breadcrumbs: () => {
    const { t } = useI18n()
    return [
      { label: t('common.itemManage', { item: t('common.user') }), to: 'users' },
      { label: t('common.addItem', { item: t('common.user') }), to: 'users-add' },
    ]
  },
})
</script>

<template>
  <UIContainer>
    <ACard
      class="c-card"
      :title="$t('common.action.item', { action: $t('common.add'), item: $t('common.user') })"
    >
      <UserAddForm
        @success="Message.success(
          $t('common.action.itemStatus', { action: $t('common.add'), item: $t('common.user'), status: $t('common.status.success') }),
        )"
      />
    </ACard>
  </UIContainer>
</template>

<style lang="css" scoped>
.c-card :deep(.arco-card-header) {
  border: none;
}
</style>
