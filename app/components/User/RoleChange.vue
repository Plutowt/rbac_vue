<script setup lang="ts">
const auth = useAuth()
const dataType = defineModel()
</script>

<template>
  <!-- 只有管理员可以切换 -->
  <a-button-group v-if="auth.info?.role !== 'user'">
    <a-button
      shape="round"
      :type="dataType === 'all' ? 'outline' : undefined"
      @click="dataType = 'all'"
    >
      <template #icon>
        <IconUserGroup />
      </template>
      {{ $t('common.displayDataType.allUser') }}
    </a-button>
    <a-button
      shape="round"
      :type="dataType === 'me' ? 'outline' : undefined"
      @click="dataType = 'me'"
    >
      <template #icon>
        <IconUser />
      </template>
      {{ $t('common.displayDataType.currentUser') }}
    </a-button>
  </a-button-group>
</template>
