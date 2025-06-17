<script setup lang="ts">
definePageMeta({
  breadcrumbs: () => {
    const { t } = useI18n()
    return [
      { label: t('common.userCenter') },
      { label: t('common.userInfo') },
    ]
  },
})
const auth = useAuth()
</script>

<template>
  <UIContainer>
    <!-- <ASpace direction="vertical" size="large" fill /> -->
    <div class="flex h-full flex-col gap-6">
      <ACard :bordered="false">
        <div class="flex w-full items-center gap-16 p-4">
          <AAvatar :size="32 * 3" class="cursor-pointer !bg-primary-5">
            {{ (auth.info?.nickname || auth.info?.username)?.slice(0, 2) }}
          </AAvatar>
          <div class="space-y-4">
            <a-descriptions
              :column="{ xs: 1 }"
              size="large"
              :data="[
                { label: $t('common.nickname'), value: auth.info?.nickname || '' },
                { label: $t('common.username'), value: auth.info?.username || '' },
                { label: $t('common.email'), value: auth.info?.email || '' },
                { label: $t('common.registerTime'), value: auth.info && $d(new Date(auth.info.createdAt), 'long') || '' },
              ]"
            />
          </div>
        </div>
      </ACard>

      <ACard :bordered="false" class="flex-1">
        <a-tabs type="rounded">
          <a-tab-pane key="1">
            <template #title>
              {{ $t('common.basicSettings') }}
            </template>
            <UserBasicInfoUpdateForm class="p-4" />
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title>
              {{ $t('common.securitySettings') }}
            </template>
            <UserChangePasswordForm class="p-4" />
          </a-tab-pane>

          <!-- <a-tab-pane key="3">
            <template #title>
              {{ $t('common.apiToken') }}
            </template>
            <UserAPIToken class="p-4" />
          </a-tab-pane> -->
        </a-tabs>
      </ACard>
    </div>
  </UIContainer>
</template>
