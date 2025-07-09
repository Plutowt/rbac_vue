<script setup lang="ts">
const auth = useAuth()
</script>

<template>
  <ADropdown>
    <AAvatar :size="34" class="cursor-pointer !bg-arco-primary-5">
      <!-- {{ auth.info }} -->
      {{ (auth.info?.nickname || auth.info?.username)?.slice(0, 2) }}
    </AAvatar>

    <template #content>
      <!-- <NuxtLinkLocale to="user-info">
        <a-doption>
          <template #icon>
            <IconUser />
          </template>
          {{ $t('common.userCenter') }}
        </a-doption>
      </NuxtLinkLocale> -->

      <!-- <NuxtLinkLocale to="openapi-access_tokens">
        <a-doption>
          <template #icon>
            <Icon name="ph:key" />
          </template>
          {{ $t('common.tokenManage') }}
        </a-doption>
      </NuxtLinkLocale> -->

      <a-doption @click="auth.logout()">
        <template #icon>
          <IconExport />
        </template>
        {{ $t('common.logout') }}
      </a-doption>
    </template>
  </ADropdown>
</template>
