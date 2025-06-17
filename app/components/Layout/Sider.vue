<script setup lang="ts">
import {
  IconApps,
  IconCommon,
  IconHome,
  IconMessage,
  IconMindMapping,
  IconUser,
  // IconApp
} from '@arco-design/web-vue/es/icon'

const { t } = useI18n()
const sidebar = useSidebar()

const items = computed<UIAnyNavigationItem[]>(() => {
  return [
    { icon: IconHome, label: t('common.menu.home'), to: '/' },
    { icon: IconUser, label: t('common.menu.userManage'), to: '/users', roles: ['admin'] },
    {
      icon: IconCommon,
      label: t('common.menu.deviceManage.label'),
      children: [
        { label: t('common.menu.deviceManage.info'), to: '/devices' },
        { label: t('common.menu.deviceManage.account'), to: '/devices/users' },
      ],
    },
    {
      icon: IconMessage,
      label: t('common.menu.smsManage.label'),
      children: [
        { label: t('common.menu.smsManage.inbox'), to: '/sms/inbox' },
        { label: t('common.menu.smsManage.outbox'), to: '/sms/outbox' },
      ],
    },
    {
      icon: IconApps,
      label: t('common.menu.appSettings.label'),
      children: [
        { label: t('common.menu.appSettings.phoneQueryTemplate'), to: '/app_settings/phone_query_templates' },
        // { label: t('common.deviceUser'), to: '/devices/users' },
      ],
    },
    // {
    //   icon: IconRelation,
    //   label: t('common.openapi'),
    //   to: '/openapi',
    // },
    { icon: IconMindMapping, label: t('common.menu.operationLog'), to: '/operation_logs', roles: ['admin'] },
  ]
})
</script>

<template>
  <a-layout-sider
    hide-trigger
    collapsible
    :width="sidebar.expanded ? sidebar.width : undefined"
    :collapsed="!sidebar.expanded"
  >
    <LayoutMenu :items="items" />
  </a-layout-sider>
</template>
